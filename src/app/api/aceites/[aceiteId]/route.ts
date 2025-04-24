import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, context: { params: Promise<{ aceiteId: string }> }) {
	try {
		const { aceiteId } = await context.params;
		const { status } = await request.json();

		// Validar o status
		if (status !== "aceito" && status !== "recusado") {
			return NextResponse.json({ error: "Status inválido" }, { status: 400 });
		}

		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

		// Busca o aceite atual para validar
		const { data: aceite, error: aceiteError } = await supabase
			.from("aceites_show")
			.select(
				`
				*,
				shows (
					id,
					banda_id
				)
			`
			)
			.eq("id", aceiteId)
			.single();

		if (aceiteError || !aceite) {
			console.error("Erro ao buscar aceite:", aceiteError);
			return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
		}

		if (aceite.status !== "pendente") {
			return NextResponse.json({ error: "Este convite já foi respondido" }, { status: 400 });
		}

		// Atualiza o status do aceite
		const { error: updateError } = await supabase.from("aceites_show").update({ status }).eq("id", aceiteId);

		if (updateError) {
			console.error("Erro ao atualizar aceite:", updateError);
			return NextResponse.json({ error: "Erro ao atualizar o convite" }, { status: 500 });
		}

		// Busca o aceite atualizado
		const { data: updatedAceite } = await supabase.from("aceites_show").select("*").eq("id", aceiteId).single();

		// Se aceitou o convite, adiciona o músico à banda
		if (status === "aceito" && aceite.shows?.banda_id) {
			const { error: membroError } = await supabase.from("membros_banda").upsert(
				{
					banda_id: aceite.shows.banda_id,
					musico_id: aceite.musico_id,
					created_at: new Date().toISOString(),
				},
				{
					onConflict: "banda_id,musico_id",
				}
			);

			if (membroError) {
				console.error("Erro ao adicionar membro à banda:", membroError);
				// Não retornamos erro aqui pois o aceite já foi registrado
			}
		}

		// Faz logout do usuário atual (se houver)
		await supabase.auth.signOut();

		return NextResponse.json(
			{
				message: "Convite atualizado com sucesso",
				data: updatedAceite,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Erro ao atualizar convite:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
