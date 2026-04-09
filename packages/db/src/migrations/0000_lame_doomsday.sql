CREATE TYPE "public"."crew_role" AS ENUM('HACKER', 'PILOT', 'MUSCLE', 'GRIFTER', 'ENGINEER');--> statement-breakpoint
CREATE TYPE "public"."mission_status" AS ENUM('PLANNING', 'READY', 'COMMITTED');--> statement-breakpoint
CREATE TYPE "public"."tool_category" AS ENUM('INFILTRATION', 'SURVEILLANCE', 'SOCIAL', 'DEMOLITION', 'ESCAPE');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crew_member" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"call_sign" text NOT NULL,
	"role" "crew_role" NOT NULL,
	"bio" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "crew_member_call_sign_unique" UNIQUE("call_sign")
);
--> statement-breakpoint
CREATE TABLE "faction" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "faction_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "mission" (
	"id" text PRIMARY KEY NOT NULL,
	"code_name" text NOT NULL,
	"target_name" text NOT NULL,
	"destination" text NOT NULL,
	"summary" text NOT NULL,
	"payout" integer NOT NULL,
	"risk_level" integer NOT NULL,
	"status" "mission_status" DEFAULT 'PLANNING' NOT NULL,
	"faction_id" text NOT NULL,
	"ship_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mission_code_name_unique" UNIQUE("code_name")
);
--> statement-breakpoint
CREATE TABLE "mission_crew_assignment" (
	"mission_id" text NOT NULL,
	"crew_member_id" text NOT NULL,
	"assignment_order" integer NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mission_crew_assignment_pk" PRIMARY KEY("mission_id","crew_member_id")
);
--> statement-breakpoint
CREATE TABLE "mission_tool_assignment" (
	"mission_id" text NOT NULL,
	"tool_id" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mission_tool_assignment_pk" PRIMARY KEY("mission_id","tool_id")
);
--> statement-breakpoint
CREATE TABLE "ship" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"ship_class" text NOT NULL,
	"stealth_rating" integer NOT NULL,
	"cargo_slots" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ship_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "tool" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" "tool_category" NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tool_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mission" ADD CONSTRAINT "mission_faction_id_faction_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."faction"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mission" ADD CONSTRAINT "mission_ship_id_ship_id_fk" FOREIGN KEY ("ship_id") REFERENCES "public"."ship"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mission_crew_assignment" ADD CONSTRAINT "mission_crew_assignment_mission_id_mission_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mission_crew_assignment" ADD CONSTRAINT "mission_crew_assignment_crew_member_id_crew_member_id_fk" FOREIGN KEY ("crew_member_id") REFERENCES "public"."crew_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mission_tool_assignment" ADD CONSTRAINT "mission_tool_assignment_mission_id_mission_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mission_tool_assignment" ADD CONSTRAINT "mission_tool_assignment_tool_id_tool_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tool"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "crew_member_role_idx" ON "crew_member" USING btree ("role");--> statement-breakpoint
CREATE INDEX "mission_faction_id_idx" ON "mission" USING btree ("faction_id");--> statement-breakpoint
CREATE INDEX "mission_ship_id_idx" ON "mission" USING btree ("ship_id");--> statement-breakpoint
CREATE INDEX "mission_status_idx" ON "mission" USING btree ("status");--> statement-breakpoint
CREATE INDEX "mission_crew_assignment_crew_member_id_idx" ON "mission_crew_assignment" USING btree ("crew_member_id");--> statement-breakpoint
CREATE INDEX "mission_tool_assignment_tool_id_idx" ON "mission_tool_assignment" USING btree ("tool_id");--> statement-breakpoint
CREATE INDEX "tool_category_idx" ON "tool" USING btree ("category");