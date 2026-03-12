import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SITE_URL = process.env.SITE_URL || "https://www.brettchereskin.com";
const API_KEY = process.env.PUBLISH_API_KEY;

if (!API_KEY) {
  console.error("PUBLISH_API_KEY environment variable is required");
  process.exit(1);
}

const server = new McpServer({
  name: "publish",
  version: "1.0.0",
});

async function apiRequest(
  method: string,
  body?: Record<string, unknown>
): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  const res = await fetch(`${SITE_URL}/api/publish`, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

function text(content: string) {
  return { content: [{ type: "text" as const, text: content }] };
}

server.registerTool(
  "publish_html",
  {
    description:
      "Publish an HTML page to brettchereskin.com/shared/{slug}. Provide complete HTML including <html>, <head>, and <body> tags.",
    inputSchema: {
      slug: z
        .string()
        .describe(
          "URL slug (lowercase letters, numbers, hyphens only, e.g. 'my-page')"
        ),
      title: z.string().describe("Page title"),
      html_content: z.string().describe("Complete HTML document content"),
      recipient_name: z
        .string()
        .optional()
        .describe("Who this page is for (optional)"),
      recipient_type: z
        .enum(["person", "project", "business"])
        .optional()
        .describe("Type of recipient (optional)"),
    },
  },
  async ({ slug, title, html_content, recipient_name, recipient_type }) => {
    const { ok, data } = await apiRequest("POST", {
      slug,
      title,
      html_content,
      recipient_name,
      recipient_type,
    });

    if (!ok) {
      return text(`Failed to publish: ${(data as { error?: string }).error || "Unknown error"}`);
    }

    return text(
      `Published successfully!\n\nURL: ${SITE_URL}/shared/${slug}\nID: ${(data as { id?: string }).id}`
    );
  }
);

server.registerTool(
  "list_pages",
  {
    description: "List all shared HTML pages with their status and visit counts",
    inputSchema: {},
  },
  async () => {
    const { ok, data } = await apiRequest("GET");

    if (!ok) {
      return text(`Failed to list pages: ${(data as { error?: string }).error || "Unknown error"}`);
    }

    const pages = (data as { pages?: Array<Record<string, unknown>> }).pages || [];
    if (pages.length === 0) {
      return text("No shared pages found.");
    }

    const lines = pages.map((p) => {
      const status = p.is_active ? "active" : "inactive";
      return `- ${p.title} (/${p.slug}) [${status}] — ${p.visit_count || 0} visits`;
    });

    return text(`Shared Pages (${pages.length}):\n\n${lines.join("\n")}`);
  }
);

server.registerTool(
  "update_page",
  {
    description:
      "Update an existing shared page's content or metadata by slug",
    inputSchema: {
      slug: z.string().describe("Slug of the page to update"),
      title: z.string().optional().describe("New title (optional)"),
      html_content: z
        .string()
        .optional()
        .describe("New HTML content (optional)"),
      is_active: z.boolean().optional().describe("Set active/inactive (optional)"),
      recipient_name: z.string().optional().describe("New recipient name (optional)"),
      recipient_type: z
        .enum(["person", "project", "business"])
        .optional()
        .describe("New recipient type (optional)"),
    },
  },
  async ({ slug, ...updates }) => {
    const { ok, data } = await apiRequest("PUT", { slug, ...updates });

    if (!ok) {
      return text(`Failed to update: ${(data as { error?: string }).error || "Unknown error"}`);
    }

    return text(`Updated "${(data as { title?: string }).title || slug}" successfully.`);
  }
);

server.registerTool(
  "dehost_page",
  {
    description: "Dehost (deactivate) a shared page by slug — it will return 404 but data is preserved",
    inputSchema: {
      slug: z.string().describe("Slug of the page to dehost"),
    },
  },
  async ({ slug }) => {
    const { ok, data } = await apiRequest("PUT", {
      slug,
      is_active: false,
    });

    if (!ok) {
      return text(`Failed to dehost: ${(data as { error?: string }).error || "Unknown error"}`);
    }

    return text(`Dehosted "${slug}" — page is now inactive.`);
  }
);

server.registerTool(
  "delete_page",
  {
    description: "Permanently delete a shared page by slug — this cannot be undone",
    inputSchema: {
      slug: z.string().describe("Slug of the page to delete"),
    },
  },
  async ({ slug }) => {
    const { ok, data } = await apiRequest("DELETE", { slug });

    if (!ok) {
      return text(`Failed to delete: ${(data as { error?: string }).error || "Unknown error"}`);
    }

    return text(`Deleted "${slug}" permanently.`);
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Publish MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
