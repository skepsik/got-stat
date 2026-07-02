CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"telegram" text,
	"legacy_id" text,
	"user_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "players_legacy_id_unique" UNIQUE("legacy_id"),
	CONSTRAINT "players_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_uid" text NOT NULL,
	"username" text,
	"raw_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_identities_provider_uid" UNIQUE("provider","provider_uid")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "got_game_type_houses" (
	"game_type_id" text NOT NULL,
	"house_id" text NOT NULL,
	CONSTRAINT "got_game_type_houses_game_type_id_house_id_pk" PRIMARY KEY("game_type_id","house_id")
);
--> statement-breakpoint
CREATE TABLE "got_game_types" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"vassals" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "got_games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"played_at" timestamp with time zone NOT NULL,
	"game_type_id" text NOT NULL,
	"recorded_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "got_houses" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "got_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"house_id" text NOT NULL,
	"player_id" uuid,
	"score" smallint NOT NULL,
	"landings" smallint NOT NULL,
	"supply" smallint NOT NULL,
	"throne" smallint NOT NULL,
	CONSTRAINT "got_results_game_house" UNIQUE("game_id","house_id")
);
--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_identities" ADD CONSTRAINT "user_identities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "got_game_type_houses" ADD CONSTRAINT "got_game_type_houses_game_type_id_got_game_types_id_fk" FOREIGN KEY ("game_type_id") REFERENCES "public"."got_game_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "got_game_type_houses" ADD CONSTRAINT "got_game_type_houses_house_id_got_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."got_houses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "got_games" ADD CONSTRAINT "got_games_game_type_id_got_game_types_id_fk" FOREIGN KEY ("game_type_id") REFERENCES "public"."got_game_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "got_games" ADD CONSTRAINT "got_games_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "got_results" ADD CONSTRAINT "got_results_game_id_got_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."got_games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "got_results" ADD CONSTRAINT "got_results_house_id_got_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."got_houses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "got_results" ADD CONSTRAINT "got_results_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;