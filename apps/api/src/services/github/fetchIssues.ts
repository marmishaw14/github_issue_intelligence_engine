import { Octokit, type RestEndpointMethodTypes } from "@octokit/rest";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

type FetchIssuesParams = {
    owner: string;
    repo: string;
    page?: number;
    perPage?: number;
};

type GithubIssue = RestEndpointMethodTypes["issues"]["listForRepo"]["response"]["data"][number];

export type NormalizedIssue = {
    id: number;
    number: number;
    owner: string;
    repo: string;
    title: string;
    body: string;
    state: "open" | "closed";
    author: string | null;
    labels: string[];
    comments: number;
    htmlUrl: string;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
};

function isIssueOnly(item: GithubIssue): item is GithubIssue & { pull_request?: never } {
    return item.pull_request === undefined;
}

function normalizeLabels(labels: GithubIssue["labels"]): string[] {
    return labels.flatMap((label) => {
        if (typeof label === "string") {
            return label;
        }

        return label.name ?? [];
    });
}

function normalizeIssue(issue: GithubIssue, owner: string, repo: string): NormalizedIssue {
    return {
        id: issue.id,
        number: issue.number,
        owner,
        repo,
        title: issue.title,
        body: issue.body ?? "",
        state: issue.state === "closed" ? "closed" : "open",
        author: issue.user?.login ?? null,
        labels: normalizeLabels(issue.labels),
        comments: issue.comments,
        htmlUrl: issue.html_url,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        closedAt: issue.closed_at,
    };
}

export async function fetchIssues(params: FetchIssuesParams) {
    const response = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner: params.owner,
        repo: params.repo,
        page: params.page ?? 1,
        per_page: params.perPage ?? 20,
        headers: {
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });

    return response.data
        .filter(isIssueOnly)
        .map((issue) => normalizeIssue(issue, params.owner, params.repo));
}
