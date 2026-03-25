import { IngestAction, IngestStatus, Prisma } from "@prisma/client";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    provider?: string;
    action?: string;
    status?: string;
    externalId?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminIngestLogsPage({ searchParams }: Props) {
  const session = await requireSuperAdminPageSession();

  const params = await searchParams;
  const provider = params.provider?.trim() ?? "";
  const action = params.action?.trim() ?? "";
  const status = params.status?.trim() ?? "";
  const externalId = params.externalId?.trim() ?? "";

  const filters: Prisma.IngestLogWhereInput = {
    ...(provider
      ? {
          provider: {
            contains: provider,
            mode: "insensitive",
          },
        }
      : {}),
    ...(externalId
      ? {
          externalId: {
            contains: externalId,
            mode: "insensitive",
          },
        }
      : {}),
    ...(action && action in IngestAction ? { action: action as IngestAction } : {}),
    ...(status && status in IngestStatus ? { responseStatus: status as IngestStatus } : {}),
  };

  const logs = await prisma.ingestLog.findMany({
    where: filters,
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return (
    <AdminShell
      section="ingest"
      userEmail={session.user.email}
      eyebrow="采集可观测性"
      title="OpenClaw 日志"
      description="这里记录 upsert、batch-upsert 和 delete 的结果，方便你判断采集是否成功、哪条数据出了问题。"
    >
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Field label="Provider" name="provider" defaultValue={provider} />
          <SelectField
            label="Action"
            name="action"
            value={action}
            options={["", ...Object.values(IngestAction)]}
          />
          <SelectField
            label="Status"
            name="status"
            value={status}
            options={["", ...Object.values(IngestStatus)]}
          />
          <Field
            label="External ID"
            name="externalId"
            defaultValue={externalId}
          />
          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="h-12 rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              应用筛选
            </button>
            <a
              href="/admin/ingest-logs"
              className="inline-flex h-12 items-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              清空
            </a>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
        <div className="hidden grid-cols-[0.9fr_0.8fr_0.8fr_1.1fr_1.4fr_0.9fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400 xl:grid">
          <p>Provider</p>
          <p>Action</p>
          <p>Status</p>
          <p>External ID</p>
          <p>Error</p>
          <p>Created</p>
        </div>

        <div className="divide-y divide-white/10">
          {logs.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-300">
              当前筛选条件下没有采集日志。
            </div>
          ) : (
            logs.map((log) => (
              <article
                key={log.id}
                className="grid grid-cols-1 gap-4 px-6 py-5 xl:grid-cols-[0.9fr_0.8fr_0.8fr_1.1fr_1.4fr_0.9fr]"
              >
                <LogCell label="Provider" value={log.provider} />
                <LogCell label="Action" value={log.action} />
                <LogCell
                  label="Status"
                  value={log.responseStatus}
                  accent={
                    log.responseStatus === "SUCCESS"
                      ? "text-emerald-300"
                      : "text-rose-300"
                  }
                />
                <LogCell label="External ID" value={log.externalId} />
                <LogCell
                  label="Error"
                  value={log.errorMessage || "No error"}
                  className="break-words"
                />
                <LogCell
                  label="Created"
                  value={log.createdAt.toLocaleString("zh-CN")}
                />
              </article>
            ))
          )}
        </div>
      </section>
    </AdminShell>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
};

function Field({ label, name, defaultValue }: FieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none"
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  value: string;
  options: string[];
};

function SelectField({ label, name, value, options }: SelectFieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-slate-300">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none"
      >
        {options.map((option) => (
          <option key={option || "all"} value={option}>
            {option || "ALL"}
          </option>
        ))}
      </select>
    </label>
  );
}

type LogCellProps = {
  label: string;
  value: string;
  accent?: string;
  className?: string;
};

function LogCell({ label, value, accent, className }: LogCellProps) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
        {label}
      </p>
      <p className={`text-sm text-slate-300 ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
