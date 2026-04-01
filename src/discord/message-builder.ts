import type {
  APIEmbed,
  RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";

const formatColor = (color: string | number): number => {
  if (typeof color === "string" && color.startsWith("#")) {
    return Number.parseInt(color.slice(1), 16);
  }
  return Number(color);
};

export class MessageBuilder {
  private embed: APIEmbed = { fields: [] };
  private content = "";

  getJSON(): RESTPostAPIWebhookWithTokenJSONBody {
    return {
      content: this.content,
      embeds: [this.embed],
    };
  }

  setText(text: string) {
    this.content = text;
    return this;
  }

  setAuthor(author: string, authorImage?: string, authorUrl?: string) {
    this.embed.author = {
      name: author,
      url: authorUrl,
      icon_url: authorImage,
    };
    return this;
  }

  setTitle(title: string) {
    this.embed.title = title;
    return this;
  }

  setURL(url: string) {
    this.embed.url = url;
    return this;
  }

  setThumbnail(thumbnail: string) {
    this.embed.thumbnail = { url: thumbnail };
    return this;
  }

  setImage(image: string) {
    this.embed.image = { url: image };
    return this;
  }

  setTimestamp(date?: Date) {
    this.embed.timestamp = (date ?? new Date()).toISOString();
    return this;
  }

  setColor(color: string | number) {
    this.embed.color = formatColor(color);
    return this;
  }

  setDescription(description: string) {
    this.embed.description = description;
    return this;
  }

  addField(fieldName: string, fieldValue: string, inline = false) {
    this.embed.fields?.push({ name: fieldName, value: fieldValue, inline });
    return this;
  }

  setFooter(footer: string, footerImage?: string) {
    this.embed.footer = { text: footer, icon_url: footerImage };
    return this;
  }
}
