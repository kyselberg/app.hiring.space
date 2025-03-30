CREATE TABLE "answers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "answers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"candidateId" varchar(255) NOT NULL,
	"isCorrect" boolean DEFAULT false NOT NULL,
	"quizId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"answers" jsonb[]
);
--> statement-breakpoint
CREATE TABLE "quizes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "quizes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" varchar(512) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" integer,
	"questions" jsonb[]
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_quizId_quizes_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quizes"("id") ON DELETE no action ON UPDATE no action;