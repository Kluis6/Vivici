import "dotenv/config";

import { createClient } from "@supabase/supabase-js";

import { createScriptPrismaClient } from "./runtime";

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = process.env.VIVICI_ADMIN_EMAIL ?? "admin@vivici.com.br";
  const adminPassword = process.env.VIVICI_ADMIN_PASSWORD;

  const missingEnv = [
    !supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : null,
    !serviceRoleKey ? "SUPABASE_SERVICE_ROLE_KEY" : null,
  ].filter(Boolean);

  if (missingEnv.length > 0) {
    throw new Error(
      `Missing required environment variables for admin sync: ${missingEnv.join(", ")}.`,
    );
  }

  if (!adminPassword) {
    throw new Error("VIVICI_ADMIN_PASSWORD is required to create or update the admin auth user.");
  }

  const { prisma, pool } = createScriptPrismaClient();

  try {
    const appUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!appUser) {
      throw new Error(`Application user ${adminEmail} was not found in the User table.`);
    }

    const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!);
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      throw listError;
    }

    const existingAuthUser = listData.users.find((user) => user.email === adminEmail);

    if (!existingAuthUser) {
      const { data: createdData, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: {
            full_name: appUser.fullName,
          },
          app_metadata: {
            role: appUser.role,
          },
        });

      if (createError || !createdData.user) {
        throw createError ?? new Error("Supabase Auth user was not created.");
      }

      await prisma.user.update({
        where: { id: appUser.id },
        data: {
          authUserId: createdData.user.id,
        },
      });

      console.log(
        JSON.stringify(
          {
            email: adminEmail,
            authUserId: createdData.user.id,
            action: "created",
          },
          null,
          2,
        ),
      );

      return;
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existingAuthUser.id,
      {
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          full_name: appUser.fullName,
        },
        app_metadata: {
          role: appUser.role,
        },
      },
    );

    if (updateError) {
      throw updateError;
    }

    await prisma.user.update({
      where: { id: appUser.id },
      data: {
        authUserId: existingAuthUser.id,
      },
    });

    console.log(
      JSON.stringify(
        {
          email: adminEmail,
          authUserId: existingAuthUser.id,
          action: "updated",
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
