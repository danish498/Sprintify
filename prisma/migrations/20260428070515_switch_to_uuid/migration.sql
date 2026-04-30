/*
  Warnings:

  - The primary key for the `activity_log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `attachments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `boards` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `custom_fields` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `labels` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `priorities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `project_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sprint_tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sprints` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `statuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_assignees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_custom_fields` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_labels` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `time_entries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `workspace_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `workspaces` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "activity_log" DROP CONSTRAINT "activity_log_project_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_log" DROP CONSTRAINT "activity_log_task_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_log" DROP CONSTRAINT "activity_log_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_task_id_fkey";

-- DropForeignKey
ALTER TABLE "boards" DROP CONSTRAINT "boards_project_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parent_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_task_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_fields" DROP CONSTRAINT "custom_fields_project_id_fkey";

-- DropForeignKey
ALTER TABLE "labels" DROP CONSTRAINT "labels_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_task_id_fkey";

-- DropForeignKey
ALTER TABLE "priorities" DROP CONSTRAINT "priorities_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_project_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "sprint_tasks" DROP CONSTRAINT "sprint_tasks_sprint_id_fkey";

-- DropForeignKey
ALTER TABLE "sprint_tasks" DROP CONSTRAINT "sprint_tasks_task_id_fkey";

-- DropForeignKey
ALTER TABLE "sprints" DROP CONSTRAINT "sprints_project_id_fkey";

-- DropForeignKey
ALTER TABLE "statuses" DROP CONSTRAINT "statuses_project_id_fkey";

-- DropForeignKey
ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_task_id_fkey";

-- DropForeignKey
ALTER TABLE "task_custom_fields" DROP CONSTRAINT "task_custom_fields_custom_field_id_fkey";

-- DropForeignKey
ALTER TABLE "task_custom_fields" DROP CONSTRAINT "task_custom_fields_task_id_fkey";

-- DropForeignKey
ALTER TABLE "task_labels" DROP CONSTRAINT "task_labels_label_id_fkey";

-- DropForeignKey
ALTER TABLE "task_labels" DROP CONSTRAINT "task_labels_task_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_board_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_parent_task_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_priority_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_project_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_status_id_fkey";

-- DropForeignKey
ALTER TABLE "time_entries" DROP CONSTRAINT "time_entries_task_id_fkey";

-- DropForeignKey
ALTER TABLE "workspace_members" DROP CONSTRAINT "workspace_members_workspace_id_fkey";

-- AlterTable
ALTER TABLE "activity_log" DROP CONSTRAINT "activity_log_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "workspace_id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ALTER COLUMN "task_id" SET DATA TYPE TEXT,
ALTER COLUMN "entity_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "activity_log_id_seq";

-- AlterTable
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "task_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "attachments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "attachments_id_seq";

-- AlterTable
ALTER TABLE "boards" DROP CONSTRAINT "boards_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "boards_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "boards_id_seq";

-- AlterTable
ALTER TABLE "comments" DROP CONSTRAINT "comments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "task_id" SET DATA TYPE TEXT,
ALTER COLUMN "parent_comment_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "comments_id_seq";

-- AlterTable
ALTER TABLE "custom_fields" DROP CONSTRAINT "custom_fields_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "custom_fields_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "custom_fields_id_seq";

-- AlterTable
ALTER TABLE "labels" DROP CONSTRAINT "labels_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "workspace_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "labels_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "labels_id_seq";

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "task_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "notifications_id_seq";

-- AlterTable
ALTER TABLE "priorities" DROP CONSTRAINT "priorities_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "workspace_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "priorities_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "priorities_id_seq";

-- AlterTable
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "project_members_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "project_members_id_seq";

-- AlterTable
ALTER TABLE "projects" DROP CONSTRAINT "projects_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "workspace_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "projects_id_seq";

-- AlterTable
ALTER TABLE "sprint_tasks" DROP CONSTRAINT "sprint_tasks_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "sprint_id" SET DATA TYPE TEXT,
ALTER COLUMN "task_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sprint_tasks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sprint_tasks_id_seq";

-- AlterTable
ALTER TABLE "sprints" DROP CONSTRAINT "sprints_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sprints_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sprints_id_seq";

-- AlterTable
ALTER TABLE "statuses" DROP CONSTRAINT "statuses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "statuses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "statuses_id_seq";

-- AlterTable
ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "task_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "task_assignees_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "task_assignees_id_seq";

-- AlterTable
ALTER TABLE "task_custom_fields" DROP CONSTRAINT "task_custom_fields_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "task_id" SET DATA TYPE TEXT,
ALTER COLUMN "custom_field_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "task_custom_fields_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "task_custom_fields_id_seq";

-- AlterTable
ALTER TABLE "task_labels" DROP CONSTRAINT "task_labels_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "task_id" SET DATA TYPE TEXT,
ALTER COLUMN "label_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "task_labels_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "task_labels_id_seq";

-- AlterTable
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ALTER COLUMN "board_id" SET DATA TYPE TEXT,
ALTER COLUMN "parent_task_id" SET DATA TYPE TEXT,
ALTER COLUMN "status_id" SET DATA TYPE TEXT,
ALTER COLUMN "priority_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tasks_id_seq";

-- AlterTable
ALTER TABLE "time_entries" DROP CONSTRAINT "time_entries_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "task_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "time_entries_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "time_entries_id_seq";

-- AlterTable
ALTER TABLE "workspace_members" DROP CONSTRAINT "workspace_members_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "workspace_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "workspace_members_id_seq";

-- AlterTable
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "workspaces_id_seq";

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statuses" ADD CONSTRAINT "statuses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "priorities" ADD CONSTRAINT "priorities_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parent_task_id_fkey" FOREIGN KEY ("parent_task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "priorities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labels" ADD CONSTRAINT "labels_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprints" ADD CONSTRAINT "sprints_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprint_tasks" ADD CONSTRAINT "sprint_tasks_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "sprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprint_tasks" ADD CONSTRAINT "sprint_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_fields" ADD CONSTRAINT "custom_fields_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_custom_fields" ADD CONSTRAINT "task_custom_fields_custom_field_id_fkey" FOREIGN KEY ("custom_field_id") REFERENCES "custom_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_custom_fields" ADD CONSTRAINT "task_custom_fields_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
