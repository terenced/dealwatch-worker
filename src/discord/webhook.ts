import { REST } from "@discordjs/rest";
import { Routes, type RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/v10";
import type { MessageBuilder } from "./message-builder";

function parseWebhookUrl(url: string): { id: string; token: string } {
  const match = url.match(/\/webhooks\/(\d+)\/(.+)$/);
  if (!match) throw new Error(`Invalid webhook URL: ${url}`);
  return { id: match[1], token: match[2] };
}

export const createHook = (env: Env) => {
  const hookUrl = env.DISCORD_WEBHOOK;
  if (!hookUrl) throw new Error("No discord URL set");
  return new Webhook(hookUrl);
};

export class Webhook {
  private rest: REST;
  private id: string;
  private token: string;

  constructor(url: string) {
    const { id, token } = parseWebhookUrl(url);
    this.id = id;
    this.token = token;
    this.rest = new REST().setToken("");
  }

  async send(content: MessageBuilder | string) {
    let body: RESTPostAPIWebhookWithTokenJSONBody;

    if (typeof content === "string") {
      body = { content };
    } else {
      body = content.getJSON();
    }

    await this.rest.post(Routes.webhook(this.id, this.token), { body, auth: false });
  }
}
