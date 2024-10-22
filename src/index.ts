import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { note } from "./note";
import { user } from "./user";

const app = new Elysia().use(swagger()).use(user).use(note).listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
