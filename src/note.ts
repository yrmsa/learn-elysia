import { Elysia, error, t } from "elysia";

class Note {
	constructor(public data: string[] = ["Moonhalo"]) {}

	add(note: string) {
		this.data.push(note);
		return this.data;
	}

	remove(index: number) {
		return this.data.splice(index, 1);
	}

	update(index: number, note: string) {
		this.data[index] = note;
		return this.data[index];
	}
}

export const note = new Elysia({ prefix: "/note" })
	.decorate("note", new Note())
	.onTransform(function log({ body, params, path, request: { method } }) {
		console.log(`${method} ${path}`, {
			body,
			params,
		});
	})
	.get("", ({ note }) => note.data)
	.put("", ({ note, body: { data } }) => note.add(data), {
		body: t.Object({
			data: t.String(),
		}),
	})
	.guard({
		params: t.Object({
			index: t.Number(),
		}),
	})
	.get("/:index", ({ note, params: { index } }) => {
		return note.data[index] ?? error(404, "oh no :(");
	})
	.delete("/:index", ({ note, params: { index } }) => {
		if (index in note.data) return note.remove(index);
		return error(422);
	})
	.patch(
		"/:index",
		({ note, params: { index }, body: { data }, error }) => {
			if (index in note.data) return note.update(index, data);
			return error(422);
		},
		{
			body: t.Object({
				data: t.String(),
			}),
		},
	);
