import { FastifyInstance } from "fastify";
import { fetchIssues } from "../services/github/fetchIssues";

type SearchIssuesQuery = {
    owner?: string;
    repo?: string;
    page?: string;
    perPage?: string;
};

export function registerSearchRoutes(app: FastifyInstance) {
    app.get<{ Querystring: SearchIssuesQuery }>("/search/issues", async (request, reply) => {
        const { owner, repo, page, perPage } = request.query;

        if (!owner || !repo) {
            return reply.status(400).send({
                error: "Both query params 'owner' and 'repo' are required."
            });
        }

        const parsedPage = page ? Number(page) : 1;
        const parsedPerPage = perPage ? Number(perPage) : 20;

        if (!Number.isInteger(parsedPage) || parsedPage < 1) {
            return reply.status(400).send({
                error: "'page' must be a positive integer."
            });
        }

        if (!Number.isInteger(parsedPerPage) || parsedPerPage < 1 || parsedPerPage > 100) {
            return reply.status(400).send({
                error: "'perPage' must be an integer between 1 and 100."
            });
        }

        const issues = await fetchIssues({
            owner,
            repo,
            page: parsedPage,
            perPage: parsedPerPage
        });

        return reply.send({ issues });
    });
}
