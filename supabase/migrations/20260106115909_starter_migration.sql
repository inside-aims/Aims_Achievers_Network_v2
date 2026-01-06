
  create table "public"."event_categories" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "name" text not null,
    "allows_nominations" boolean not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."event_categories" enable row level security;


  create table "public"."event_organizers" (
    "event_id" uuid not null,
    "user_id" uuid not null,
    "role" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."event_organizers" enable row level security;


  create table "public"."event_settings" (
    "event_id" uuid not null,
    "vote_visibility" text not null,
    "allow_bulk_votes" boolean not null,
    "nominations_open" boolean not null,
    "nomination_requires_auth" boolean not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."event_settings" enable row level security;


  create table "public"."event_shortcode_sequences" (
    "event_id" uuid not null,
    "last_value" integer not null
      );


alter table "public"."event_shortcode_sequences" enable row level security;


  create table "public"."events" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "slug" text not null,
    "event_code" text not null,
    "description" text,
    "avatar_image_url" text,
    "status" text not null,
    "voting_starts_at" timestamp with time zone,
    "voting_ends_at" timestamp with time zone,
    "commission_rate" numeric(5,2) not null,
    "created_at" timestamp with time zone not null default now(),
    "location" text,
    "event_date" date
      );


alter table "public"."events" enable row level security;


  create table "public"."nomination_submissions" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "category_id" uuid not null,
    "nominee_name" text not null,
    "nominee_identifier" text,
    "avatar_image_url" text,
    "submitted_by_user_id" uuid,
    "status" text not null,
    "approved_at" timestamp with time zone,
    "approved_by" uuid,
    "nominee_id" uuid,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."nomination_submissions" enable row level security;


  create table "public"."nominees" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "category_id" uuid not null,
    "display_name" text not null,
    "shortcode" text not null,
    "avatar_image_url" text,
    "status" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."nominees" enable row level security;


  create table "public"."organizer_profiles" (
    "user_id" uuid not null,
    "display_name" text not null,
    "avatar_image_url" text,
    "role" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."organizer_profiles" enable row level security;


  create table "public"."outlets" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "avatar_image_url" text,
    "is_platform_global" boolean not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."outlets" enable row level security;


  create table "public"."payment_intents" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "nominee_id" uuid not null,
    "amount" numeric(12,2) not null,
    "vote_quantity" integer not null,
    "provider" text not null,
    "reference" text not null,
    "status" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."payment_intents" enable row level security;


  create table "public"."payments" (
    "id" uuid not null default gen_random_uuid(),
    "payment_intent_id" uuid not null,
    "provider_reference" text not null,
    "gross_amount" numeric(12,2) not null,
    "confirmed_at" timestamp with time zone not null
      );


alter table "public"."payments" enable row level security;


  create table "public"."revenue_breakdown" (
    "payment_id" uuid not null,
    "platform_fee" numeric(12,2) not null,
    "organizer_amount" numeric(12,2) not null
      );


alter table "public"."revenue_breakdown" enable row level security;


  create table "public"."votes" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "nominee_id" uuid not null,
    "payment_id" uuid not null,
    "quantity" integer not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."votes" enable row level security;

CREATE UNIQUE INDEX event_categories_pkey ON public.event_categories USING btree (id);

CREATE UNIQUE INDEX event_organizers_pkey ON public.event_organizers USING btree (event_id, user_id);

CREATE UNIQUE INDEX event_settings_pkey ON public.event_settings USING btree (event_id);

CREATE UNIQUE INDEX event_shortcode_sequences_pkey ON public.event_shortcode_sequences USING btree (event_id);

CREATE UNIQUE INDEX events_event_code_key ON public.events USING btree (event_code);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE UNIQUE INDEX events_slug_key ON public.events USING btree (slug);

CREATE INDEX idx_event_categories_event ON public.event_categories USING btree (event_id);

CREATE INDEX idx_event_organizers_user ON public.event_organizers USING btree (user_id);

CREATE INDEX idx_events_status ON public.events USING btree (status);

CREATE INDEX idx_nomination_event_status ON public.nomination_submissions USING btree (event_id, status);

CREATE INDEX idx_nominees_category ON public.nominees USING btree (category_id);

CREATE INDEX idx_nominees_event ON public.nominees USING btree (event_id);

CREATE INDEX idx_payment_intents_event ON public.payment_intents USING btree (event_id);

CREATE INDEX idx_votes_event ON public.votes USING btree (event_id);

CREATE INDEX idx_votes_nominee ON public.votes USING btree (nominee_id);

CREATE UNIQUE INDEX nomination_submissions_pkey ON public.nomination_submissions USING btree (id);

CREATE UNIQUE INDEX nominees_event_id_shortcode_key ON public.nominees USING btree (event_id, shortcode);

CREATE UNIQUE INDEX nominees_pkey ON public.nominees USING btree (id);

CREATE UNIQUE INDEX organizer_profiles_pkey ON public.organizer_profiles USING btree (user_id);

CREATE UNIQUE INDEX outlets_pkey ON public.outlets USING btree (id);

CREATE UNIQUE INDEX payment_intents_pkey ON public.payment_intents USING btree (id);

CREATE UNIQUE INDEX payment_intents_reference_key ON public.payment_intents USING btree (reference);

CREATE UNIQUE INDEX payments_payment_intent_id_key ON public.payments USING btree (payment_intent_id);

CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id);

CREATE UNIQUE INDEX revenue_breakdown_pkey ON public.revenue_breakdown USING btree (payment_id);

CREATE UNIQUE INDEX votes_payment_id_key ON public.votes USING btree (payment_id);

CREATE UNIQUE INDEX votes_pkey ON public.votes USING btree (id);

alter table "public"."event_categories" add constraint "event_categories_pkey" PRIMARY KEY using index "event_categories_pkey";

alter table "public"."event_organizers" add constraint "event_organizers_pkey" PRIMARY KEY using index "event_organizers_pkey";

alter table "public"."event_settings" add constraint "event_settings_pkey" PRIMARY KEY using index "event_settings_pkey";

alter table "public"."event_shortcode_sequences" add constraint "event_shortcode_sequences_pkey" PRIMARY KEY using index "event_shortcode_sequences_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."nomination_submissions" add constraint "nomination_submissions_pkey" PRIMARY KEY using index "nomination_submissions_pkey";

alter table "public"."nominees" add constraint "nominees_pkey" PRIMARY KEY using index "nominees_pkey";

alter table "public"."organizer_profiles" add constraint "organizer_profiles_pkey" PRIMARY KEY using index "organizer_profiles_pkey";

alter table "public"."outlets" add constraint "outlets_pkey" PRIMARY KEY using index "outlets_pkey";

alter table "public"."payment_intents" add constraint "payment_intents_pkey" PRIMARY KEY using index "payment_intents_pkey";

alter table "public"."payments" add constraint "payments_pkey" PRIMARY KEY using index "payments_pkey";

alter table "public"."revenue_breakdown" add constraint "revenue_breakdown_pkey" PRIMARY KEY using index "revenue_breakdown_pkey";

alter table "public"."votes" add constraint "votes_pkey" PRIMARY KEY using index "votes_pkey";

alter table "public"."event_categories" add constraint "event_categories_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_categories" validate constraint "event_categories_event_id_fkey";

alter table "public"."event_organizers" add constraint "event_organizers_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'manager'::text, 'viewer'::text]))) not valid;

alter table "public"."event_organizers" validate constraint "event_organizers_role_check";

alter table "public"."event_settings" add constraint "event_settings_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_settings" validate constraint "event_settings_event_id_fkey";

alter table "public"."event_settings" add constraint "event_settings_vote_visibility_check" CHECK ((vote_visibility = ANY (ARRAY['public'::text, 'hidden'::text, 'nominee_hidden'::text]))) not valid;

alter table "public"."event_settings" validate constraint "event_settings_vote_visibility_check";

alter table "public"."event_shortcode_sequences" add constraint "event_shortcode_sequences_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_shortcode_sequences" validate constraint "event_shortcode_sequences_event_id_fkey";

alter table "public"."events" add constraint "events_event_code_key" UNIQUE using index "events_event_code_key";

alter table "public"."events" add constraint "events_slug_key" UNIQUE using index "events_slug_key";

alter table "public"."events" add constraint "events_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'live'::text, 'closed'::text]))) not valid;

alter table "public"."events" validate constraint "events_status_check";

alter table "public"."nomination_submissions" add constraint "nomination_submissions_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES auth.users(id) not valid;

alter table "public"."nomination_submissions" validate constraint "nomination_submissions_approved_by_fkey";

alter table "public"."nomination_submissions" add constraint "nomination_submissions_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.event_categories(id) ON DELETE CASCADE not valid;

alter table "public"."nomination_submissions" validate constraint "nomination_submissions_category_id_fkey";

alter table "public"."nomination_submissions" add constraint "nomination_submissions_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."nomination_submissions" validate constraint "nomination_submissions_event_id_fkey";

alter table "public"."nomination_submissions" add constraint "nomination_submissions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))) not valid;

alter table "public"."nomination_submissions" validate constraint "nomination_submissions_status_check";

alter table "public"."nomination_submissions" add constraint "nomination_submissions_submitted_by_user_id_fkey" FOREIGN KEY (submitted_by_user_id) REFERENCES auth.users(id) not valid;

alter table "public"."nomination_submissions" validate constraint "nomination_submissions_submitted_by_user_id_fkey";

alter table "public"."nominees" add constraint "nominees_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.event_categories(id) ON DELETE CASCADE not valid;

alter table "public"."nominees" validate constraint "nominees_category_id_fkey";

alter table "public"."nominees" add constraint "nominees_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."nominees" validate constraint "nominees_event_id_fkey";

alter table "public"."nominees" add constraint "nominees_event_id_shortcode_key" UNIQUE using index "nominees_event_id_shortcode_key";

alter table "public"."nominees" add constraint "nominees_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'disabled'::text]))) not valid;

alter table "public"."nominees" validate constraint "nominees_status_check";

alter table "public"."organizer_profiles" add constraint "organizer_profiles_role_check" CHECK ((role = ANY (ARRAY['organizer'::text, 'admin'::text]))) not valid;

alter table "public"."organizer_profiles" validate constraint "organizer_profiles_role_check";

alter table "public"."organizer_profiles" add constraint "organizer_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."organizer_profiles" validate constraint "organizer_profiles_user_id_fkey";

alter table "public"."payment_intents" add constraint "payment_intents_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) not valid;

alter table "public"."payment_intents" validate constraint "payment_intents_event_id_fkey";

alter table "public"."payment_intents" add constraint "payment_intents_nominee_id_fkey" FOREIGN KEY (nominee_id) REFERENCES public.nominees(id) not valid;

alter table "public"."payment_intents" validate constraint "payment_intents_nominee_id_fkey";

alter table "public"."payment_intents" add constraint "payment_intents_reference_key" UNIQUE using index "payment_intents_reference_key";

alter table "public"."payment_intents" add constraint "payment_intents_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'failed'::text]))) not valid;

alter table "public"."payment_intents" validate constraint "payment_intents_status_check";

alter table "public"."payments" add constraint "payments_payment_intent_id_fkey" FOREIGN KEY (payment_intent_id) REFERENCES public.payment_intents(id) not valid;

alter table "public"."payments" validate constraint "payments_payment_intent_id_fkey";

alter table "public"."payments" add constraint "payments_payment_intent_id_key" UNIQUE using index "payments_payment_intent_id_key";

alter table "public"."revenue_breakdown" add constraint "revenue_breakdown_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE CASCADE not valid;

alter table "public"."revenue_breakdown" validate constraint "revenue_breakdown_payment_id_fkey";

alter table "public"."votes" add constraint "votes_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) not valid;

alter table "public"."votes" validate constraint "votes_event_id_fkey";

alter table "public"."votes" add constraint "votes_nominee_id_fkey" FOREIGN KEY (nominee_id) REFERENCES public.nominees(id) not valid;

alter table "public"."votes" validate constraint "votes_nominee_id_fkey";

alter table "public"."votes" add constraint "votes_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES public.payments(id) not valid;

alter table "public"."votes" validate constraint "votes_payment_id_fkey";

alter table "public"."votes" add constraint "votes_payment_id_key" UNIQUE using index "votes_payment_id_key";

alter table "public"."votes" add constraint "votes_quantity_check" CHECK ((quantity > 0)) not valid;

alter table "public"."votes" validate constraint "votes_quantity_check";

grant delete on table "public"."event_categories" to "anon";

grant insert on table "public"."event_categories" to "anon";

grant references on table "public"."event_categories" to "anon";

grant select on table "public"."event_categories" to "anon";

grant trigger on table "public"."event_categories" to "anon";

grant truncate on table "public"."event_categories" to "anon";

grant update on table "public"."event_categories" to "anon";

grant delete on table "public"."event_categories" to "authenticated";

grant insert on table "public"."event_categories" to "authenticated";

grant references on table "public"."event_categories" to "authenticated";

grant select on table "public"."event_categories" to "authenticated";

grant trigger on table "public"."event_categories" to "authenticated";

grant truncate on table "public"."event_categories" to "authenticated";

grant update on table "public"."event_categories" to "authenticated";

grant delete on table "public"."event_categories" to "postgres";

grant insert on table "public"."event_categories" to "postgres";

grant references on table "public"."event_categories" to "postgres";

grant select on table "public"."event_categories" to "postgres";

grant trigger on table "public"."event_categories" to "postgres";

grant truncate on table "public"."event_categories" to "postgres";

grant update on table "public"."event_categories" to "postgres";

grant delete on table "public"."event_categories" to "service_role";

grant insert on table "public"."event_categories" to "service_role";

grant references on table "public"."event_categories" to "service_role";

grant select on table "public"."event_categories" to "service_role";

grant trigger on table "public"."event_categories" to "service_role";

grant truncate on table "public"."event_categories" to "service_role";

grant update on table "public"."event_categories" to "service_role";

grant delete on table "public"."event_organizers" to "anon";

grant insert on table "public"."event_organizers" to "anon";

grant references on table "public"."event_organizers" to "anon";

grant select on table "public"."event_organizers" to "anon";

grant trigger on table "public"."event_organizers" to "anon";

grant truncate on table "public"."event_organizers" to "anon";

grant update on table "public"."event_organizers" to "anon";

grant delete on table "public"."event_organizers" to "authenticated";

grant insert on table "public"."event_organizers" to "authenticated";

grant references on table "public"."event_organizers" to "authenticated";

grant select on table "public"."event_organizers" to "authenticated";

grant trigger on table "public"."event_organizers" to "authenticated";

grant truncate on table "public"."event_organizers" to "authenticated";

grant update on table "public"."event_organizers" to "authenticated";

grant delete on table "public"."event_organizers" to "postgres";

grant insert on table "public"."event_organizers" to "postgres";

grant references on table "public"."event_organizers" to "postgres";

grant select on table "public"."event_organizers" to "postgres";

grant trigger on table "public"."event_organizers" to "postgres";

grant truncate on table "public"."event_organizers" to "postgres";

grant update on table "public"."event_organizers" to "postgres";

grant delete on table "public"."event_organizers" to "service_role";

grant insert on table "public"."event_organizers" to "service_role";

grant references on table "public"."event_organizers" to "service_role";

grant select on table "public"."event_organizers" to "service_role";

grant trigger on table "public"."event_organizers" to "service_role";

grant truncate on table "public"."event_organizers" to "service_role";

grant update on table "public"."event_organizers" to "service_role";

grant delete on table "public"."event_settings" to "anon";

grant insert on table "public"."event_settings" to "anon";

grant references on table "public"."event_settings" to "anon";

grant select on table "public"."event_settings" to "anon";

grant trigger on table "public"."event_settings" to "anon";

grant truncate on table "public"."event_settings" to "anon";

grant update on table "public"."event_settings" to "anon";

grant delete on table "public"."event_settings" to "authenticated";

grant insert on table "public"."event_settings" to "authenticated";

grant references on table "public"."event_settings" to "authenticated";

grant select on table "public"."event_settings" to "authenticated";

grant trigger on table "public"."event_settings" to "authenticated";

grant truncate on table "public"."event_settings" to "authenticated";

grant update on table "public"."event_settings" to "authenticated";

grant delete on table "public"."event_settings" to "postgres";

grant insert on table "public"."event_settings" to "postgres";

grant references on table "public"."event_settings" to "postgres";

grant select on table "public"."event_settings" to "postgres";

grant trigger on table "public"."event_settings" to "postgres";

grant truncate on table "public"."event_settings" to "postgres";

grant update on table "public"."event_settings" to "postgres";

grant delete on table "public"."event_settings" to "service_role";

grant insert on table "public"."event_settings" to "service_role";

grant references on table "public"."event_settings" to "service_role";

grant select on table "public"."event_settings" to "service_role";

grant trigger on table "public"."event_settings" to "service_role";

grant truncate on table "public"."event_settings" to "service_role";

grant update on table "public"."event_settings" to "service_role";

grant delete on table "public"."event_shortcode_sequences" to "anon";

grant insert on table "public"."event_shortcode_sequences" to "anon";

grant references on table "public"."event_shortcode_sequences" to "anon";

grant select on table "public"."event_shortcode_sequences" to "anon";

grant trigger on table "public"."event_shortcode_sequences" to "anon";

grant truncate on table "public"."event_shortcode_sequences" to "anon";

grant update on table "public"."event_shortcode_sequences" to "anon";

grant delete on table "public"."event_shortcode_sequences" to "authenticated";

grant insert on table "public"."event_shortcode_sequences" to "authenticated";

grant references on table "public"."event_shortcode_sequences" to "authenticated";

grant select on table "public"."event_shortcode_sequences" to "authenticated";

grant trigger on table "public"."event_shortcode_sequences" to "authenticated";

grant truncate on table "public"."event_shortcode_sequences" to "authenticated";

grant update on table "public"."event_shortcode_sequences" to "authenticated";

grant delete on table "public"."event_shortcode_sequences" to "postgres";

grant insert on table "public"."event_shortcode_sequences" to "postgres";

grant references on table "public"."event_shortcode_sequences" to "postgres";

grant select on table "public"."event_shortcode_sequences" to "postgres";

grant trigger on table "public"."event_shortcode_sequences" to "postgres";

grant truncate on table "public"."event_shortcode_sequences" to "postgres";

grant update on table "public"."event_shortcode_sequences" to "postgres";

grant delete on table "public"."event_shortcode_sequences" to "service_role";

grant insert on table "public"."event_shortcode_sequences" to "service_role";

grant references on table "public"."event_shortcode_sequences" to "service_role";

grant select on table "public"."event_shortcode_sequences" to "service_role";

grant trigger on table "public"."event_shortcode_sequences" to "service_role";

grant truncate on table "public"."event_shortcode_sequences" to "service_role";

grant update on table "public"."event_shortcode_sequences" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "postgres";

grant insert on table "public"."events" to "postgres";

grant references on table "public"."events" to "postgres";

grant select on table "public"."events" to "postgres";

grant trigger on table "public"."events" to "postgres";

grant truncate on table "public"."events" to "postgres";

grant update on table "public"."events" to "postgres";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."nomination_submissions" to "anon";

grant insert on table "public"."nomination_submissions" to "anon";

grant references on table "public"."nomination_submissions" to "anon";

grant select on table "public"."nomination_submissions" to "anon";

grant trigger on table "public"."nomination_submissions" to "anon";

grant truncate on table "public"."nomination_submissions" to "anon";

grant update on table "public"."nomination_submissions" to "anon";

grant delete on table "public"."nomination_submissions" to "authenticated";

grant insert on table "public"."nomination_submissions" to "authenticated";

grant references on table "public"."nomination_submissions" to "authenticated";

grant select on table "public"."nomination_submissions" to "authenticated";

grant trigger on table "public"."nomination_submissions" to "authenticated";

grant truncate on table "public"."nomination_submissions" to "authenticated";

grant update on table "public"."nomination_submissions" to "authenticated";

grant delete on table "public"."nomination_submissions" to "postgres";

grant insert on table "public"."nomination_submissions" to "postgres";

grant references on table "public"."nomination_submissions" to "postgres";

grant select on table "public"."nomination_submissions" to "postgres";

grant trigger on table "public"."nomination_submissions" to "postgres";

grant truncate on table "public"."nomination_submissions" to "postgres";

grant update on table "public"."nomination_submissions" to "postgres";

grant delete on table "public"."nomination_submissions" to "service_role";

grant insert on table "public"."nomination_submissions" to "service_role";

grant references on table "public"."nomination_submissions" to "service_role";

grant select on table "public"."nomination_submissions" to "service_role";

grant trigger on table "public"."nomination_submissions" to "service_role";

grant truncate on table "public"."nomination_submissions" to "service_role";

grant update on table "public"."nomination_submissions" to "service_role";

grant delete on table "public"."nominees" to "anon";

grant insert on table "public"."nominees" to "anon";

grant references on table "public"."nominees" to "anon";

grant select on table "public"."nominees" to "anon";

grant trigger on table "public"."nominees" to "anon";

grant truncate on table "public"."nominees" to "anon";

grant update on table "public"."nominees" to "anon";

grant delete on table "public"."nominees" to "authenticated";

grant insert on table "public"."nominees" to "authenticated";

grant references on table "public"."nominees" to "authenticated";

grant select on table "public"."nominees" to "authenticated";

grant trigger on table "public"."nominees" to "authenticated";

grant truncate on table "public"."nominees" to "authenticated";

grant update on table "public"."nominees" to "authenticated";

grant delete on table "public"."nominees" to "postgres";

grant insert on table "public"."nominees" to "postgres";

grant references on table "public"."nominees" to "postgres";

grant select on table "public"."nominees" to "postgres";

grant trigger on table "public"."nominees" to "postgres";

grant truncate on table "public"."nominees" to "postgres";

grant update on table "public"."nominees" to "postgres";

grant delete on table "public"."nominees" to "service_role";

grant insert on table "public"."nominees" to "service_role";

grant references on table "public"."nominees" to "service_role";

grant select on table "public"."nominees" to "service_role";

grant trigger on table "public"."nominees" to "service_role";

grant truncate on table "public"."nominees" to "service_role";

grant update on table "public"."nominees" to "service_role";

grant delete on table "public"."organizer_profiles" to "anon";

grant insert on table "public"."organizer_profiles" to "anon";

grant references on table "public"."organizer_profiles" to "anon";

grant select on table "public"."organizer_profiles" to "anon";

grant trigger on table "public"."organizer_profiles" to "anon";

grant truncate on table "public"."organizer_profiles" to "anon";

grant update on table "public"."organizer_profiles" to "anon";

grant delete on table "public"."organizer_profiles" to "authenticated";

grant insert on table "public"."organizer_profiles" to "authenticated";

grant references on table "public"."organizer_profiles" to "authenticated";

grant select on table "public"."organizer_profiles" to "authenticated";

grant trigger on table "public"."organizer_profiles" to "authenticated";

grant truncate on table "public"."organizer_profiles" to "authenticated";

grant update on table "public"."organizer_profiles" to "authenticated";

grant delete on table "public"."organizer_profiles" to "postgres";

grant insert on table "public"."organizer_profiles" to "postgres";

grant references on table "public"."organizer_profiles" to "postgres";

grant select on table "public"."organizer_profiles" to "postgres";

grant trigger on table "public"."organizer_profiles" to "postgres";

grant truncate on table "public"."organizer_profiles" to "postgres";

grant update on table "public"."organizer_profiles" to "postgres";

grant delete on table "public"."organizer_profiles" to "service_role";

grant insert on table "public"."organizer_profiles" to "service_role";

grant references on table "public"."organizer_profiles" to "service_role";

grant select on table "public"."organizer_profiles" to "service_role";

grant trigger on table "public"."organizer_profiles" to "service_role";

grant truncate on table "public"."organizer_profiles" to "service_role";

grant update on table "public"."organizer_profiles" to "service_role";

grant delete on table "public"."outlets" to "anon";

grant insert on table "public"."outlets" to "anon";

grant references on table "public"."outlets" to "anon";

grant select on table "public"."outlets" to "anon";

grant trigger on table "public"."outlets" to "anon";

grant truncate on table "public"."outlets" to "anon";

grant update on table "public"."outlets" to "anon";

grant delete on table "public"."outlets" to "authenticated";

grant insert on table "public"."outlets" to "authenticated";

grant references on table "public"."outlets" to "authenticated";

grant select on table "public"."outlets" to "authenticated";

grant trigger on table "public"."outlets" to "authenticated";

grant truncate on table "public"."outlets" to "authenticated";

grant update on table "public"."outlets" to "authenticated";

grant delete on table "public"."outlets" to "postgres";

grant insert on table "public"."outlets" to "postgres";

grant references on table "public"."outlets" to "postgres";

grant select on table "public"."outlets" to "postgres";

grant trigger on table "public"."outlets" to "postgres";

grant truncate on table "public"."outlets" to "postgres";

grant update on table "public"."outlets" to "postgres";

grant delete on table "public"."outlets" to "service_role";

grant insert on table "public"."outlets" to "service_role";

grant references on table "public"."outlets" to "service_role";

grant select on table "public"."outlets" to "service_role";

grant trigger on table "public"."outlets" to "service_role";

grant truncate on table "public"."outlets" to "service_role";

grant update on table "public"."outlets" to "service_role";

grant delete on table "public"."payment_intents" to "anon";

grant insert on table "public"."payment_intents" to "anon";

grant references on table "public"."payment_intents" to "anon";

grant select on table "public"."payment_intents" to "anon";

grant trigger on table "public"."payment_intents" to "anon";

grant truncate on table "public"."payment_intents" to "anon";

grant update on table "public"."payment_intents" to "anon";

grant delete on table "public"."payment_intents" to "authenticated";

grant insert on table "public"."payment_intents" to "authenticated";

grant references on table "public"."payment_intents" to "authenticated";

grant select on table "public"."payment_intents" to "authenticated";

grant trigger on table "public"."payment_intents" to "authenticated";

grant truncate on table "public"."payment_intents" to "authenticated";

grant update on table "public"."payment_intents" to "authenticated";

grant delete on table "public"."payment_intents" to "postgres";

grant insert on table "public"."payment_intents" to "postgres";

grant references on table "public"."payment_intents" to "postgres";

grant select on table "public"."payment_intents" to "postgres";

grant trigger on table "public"."payment_intents" to "postgres";

grant truncate on table "public"."payment_intents" to "postgres";

grant update on table "public"."payment_intents" to "postgres";

grant delete on table "public"."payment_intents" to "service_role";

grant insert on table "public"."payment_intents" to "service_role";

grant references on table "public"."payment_intents" to "service_role";

grant select on table "public"."payment_intents" to "service_role";

grant trigger on table "public"."payment_intents" to "service_role";

grant truncate on table "public"."payment_intents" to "service_role";

grant update on table "public"."payment_intents" to "service_role";

grant delete on table "public"."payments" to "anon";

grant insert on table "public"."payments" to "anon";

grant references on table "public"."payments" to "anon";

grant select on table "public"."payments" to "anon";

grant trigger on table "public"."payments" to "anon";

grant truncate on table "public"."payments" to "anon";

grant update on table "public"."payments" to "anon";

grant delete on table "public"."payments" to "authenticated";

grant insert on table "public"."payments" to "authenticated";

grant references on table "public"."payments" to "authenticated";

grant select on table "public"."payments" to "authenticated";

grant trigger on table "public"."payments" to "authenticated";

grant truncate on table "public"."payments" to "authenticated";

grant update on table "public"."payments" to "authenticated";

grant delete on table "public"."payments" to "postgres";

grant insert on table "public"."payments" to "postgres";

grant references on table "public"."payments" to "postgres";

grant select on table "public"."payments" to "postgres";

grant trigger on table "public"."payments" to "postgres";

grant truncate on table "public"."payments" to "postgres";

grant update on table "public"."payments" to "postgres";

grant delete on table "public"."payments" to "service_role";

grant insert on table "public"."payments" to "service_role";

grant references on table "public"."payments" to "service_role";

grant select on table "public"."payments" to "service_role";

grant trigger on table "public"."payments" to "service_role";

grant truncate on table "public"."payments" to "service_role";

grant update on table "public"."payments" to "service_role";

grant delete on table "public"."revenue_breakdown" to "anon";

grant insert on table "public"."revenue_breakdown" to "anon";

grant references on table "public"."revenue_breakdown" to "anon";

grant select on table "public"."revenue_breakdown" to "anon";

grant trigger on table "public"."revenue_breakdown" to "anon";

grant truncate on table "public"."revenue_breakdown" to "anon";

grant update on table "public"."revenue_breakdown" to "anon";

grant delete on table "public"."revenue_breakdown" to "authenticated";

grant insert on table "public"."revenue_breakdown" to "authenticated";

grant references on table "public"."revenue_breakdown" to "authenticated";

grant select on table "public"."revenue_breakdown" to "authenticated";

grant trigger on table "public"."revenue_breakdown" to "authenticated";

grant truncate on table "public"."revenue_breakdown" to "authenticated";

grant update on table "public"."revenue_breakdown" to "authenticated";

grant delete on table "public"."revenue_breakdown" to "postgres";

grant insert on table "public"."revenue_breakdown" to "postgres";

grant references on table "public"."revenue_breakdown" to "postgres";

grant select on table "public"."revenue_breakdown" to "postgres";

grant trigger on table "public"."revenue_breakdown" to "postgres";

grant truncate on table "public"."revenue_breakdown" to "postgres";

grant update on table "public"."revenue_breakdown" to "postgres";

grant delete on table "public"."revenue_breakdown" to "service_role";

grant insert on table "public"."revenue_breakdown" to "service_role";

grant references on table "public"."revenue_breakdown" to "service_role";

grant select on table "public"."revenue_breakdown" to "service_role";

grant trigger on table "public"."revenue_breakdown" to "service_role";

grant truncate on table "public"."revenue_breakdown" to "service_role";

grant update on table "public"."revenue_breakdown" to "service_role";

grant delete on table "public"."votes" to "anon";

grant insert on table "public"."votes" to "anon";

grant references on table "public"."votes" to "anon";

grant select on table "public"."votes" to "anon";

grant trigger on table "public"."votes" to "anon";

grant truncate on table "public"."votes" to "anon";

grant update on table "public"."votes" to "anon";

grant delete on table "public"."votes" to "authenticated";

grant insert on table "public"."votes" to "authenticated";

grant references on table "public"."votes" to "authenticated";

grant select on table "public"."votes" to "authenticated";

grant trigger on table "public"."votes" to "authenticated";

grant truncate on table "public"."votes" to "authenticated";

grant update on table "public"."votes" to "authenticated";

grant delete on table "public"."votes" to "postgres";

grant insert on table "public"."votes" to "postgres";

grant references on table "public"."votes" to "postgres";

grant select on table "public"."votes" to "postgres";

grant trigger on table "public"."votes" to "postgres";

grant truncate on table "public"."votes" to "postgres";

grant update on table "public"."votes" to "postgres";

grant delete on table "public"."votes" to "service_role";

grant insert on table "public"."votes" to "service_role";

grant references on table "public"."votes" to "service_role";

grant select on table "public"."votes" to "service_role";

grant trigger on table "public"."votes" to "service_role";

grant truncate on table "public"."votes" to "service_role";

grant update on table "public"."votes" to "service_role";


  create policy "organizers can access their events"
  on "public"."event_organizers"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "organizers can read event settings"
  on "public"."event_settings"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.event_organizers eo
  WHERE ((eo.event_id = event_settings.event_id) AND (eo.user_id = auth.uid())))));



  create policy "organizers can read their events"
  on "public"."events"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.event_organizers eo
  WHERE ((eo.event_id = events.id) AND (eo.user_id = auth.uid())))));



  create policy "organizers manage nominations"
  on "public"."nomination_submissions"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.event_organizers eo
  WHERE ((eo.event_id = nomination_submissions.event_id) AND (eo.user_id = auth.uid())))));



  create policy "public read nominees for live events"
  on "public"."nominees"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = nominees.event_id) AND (e.status = 'live'::text)))));



  create policy "organizer can read own profile"
  on "public"."organizer_profiles"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "public read outlets"
  on "public"."outlets"
  as permissive
  for select
  to public
using (true);




