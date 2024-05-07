// Based off of https://github.com/LilSpoodermann/discord-ts-webhook/

import { MessageBuilder, type WebhookPayload } from "./message-builder";

export type WebhookOptions = {
  url: string;
  throwErrors?: boolean;
  retryOnLimit?: boolean;
};

export const createHook = (env: Env) => {
  const hookUrl = env.DISCORD_WEBHOOK;
  if (!hookUrl) throw Error("No discord URL set");
  return new Webhook(hookUrl);
};

export default class Webhook {
  private url: string;
  private throwErrors?: boolean;
  private retryOnLimit?: boolean;
  private payload: any = {};

  constructor(options: string | WebhookOptions) {
    this.payload = {};

    if (typeof options == "string") {
      this.url = options;
      this.throwErrors = false;
      this.retryOnLimit = true;
    } else {
      this.url = options.url;
      this.throwErrors =
        options.throwErrors == undefined ? true : options.throwErrors;
      this.retryOnLimit =
        options.retryOnLimit == undefined ? true : options.retryOnLimit;
    }
  }

  setUsername(username: string) {
    this.payload.username = username;

    return this;
  }

  setAvatar(avatarURL: string) {
    this.payload.avatar_url = avatarURL;

    return this;
  }

  private async post(payload: WebhookPayload) {
    return await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  async send(content: MessageBuilder | string) {
    let payload: WebhookPayload;

    if (typeof content === "string") {
      payload = new MessageBuilder().setText(content).getJSON();
    } else {
      payload = content.getJSON();
    }

    try {
      const res = await this.post(payload);

      if (res.status === 430 && this.retryOnLimit) {
        const body = (await res.json()) as { retry_after: number };
        const waitUntil = body["retry_after"];

        setTimeout(() => this.post(payload), waitUntil);
      } else if (res.status != 204) {
        const text = await res.text();
        throw new Error(
          `Error sending webhook: ${res.status} status code. Response: ${text}`,
        );
      }
    } catch (err) {
      console.error(err);
      if (this.throwErrors) {
        const error = isError(err) ? err.message : err;
        throw new Error(`${error}`);
      }
    }
  }
}

function isError(err: Error | unknown): err is Error {
  return err instanceof Error;
}
