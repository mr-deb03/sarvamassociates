import { TriangleAlert } from "lucide-react";

/**
 * Shown in the admin panel when the record store cannot be reached.
 *
 * This exists because of a specific deployment shape: a live site whose
 * database sits on someone's own machine behind a tunnel. That link goes down
 * for ordinary reasons — the PC sleeps, the tunnel restarts, the home
 * connection drops — and when it does, the useful thing is a page that names
 * the problem, not a 500.
 *
 * The message is only ever rendered behind the admin login, so it can afford
 * to be specific. `target` comes from storageLocation(), which strips the
 * password out of the connection string.
 */
export function StorageError({
  target,
  detail,
}: {
  target: string;
  detail: string;
}) {
  return (
    <div className="border-error/30 bg-error/[0.05] rounded-card border p-6 sm:p-8">
      <h2 className="font-display text-navy flex items-center gap-3 text-base font-semibold">
        <TriangleAlert
          aria-hidden
          strokeWidth={1.75}
          className="text-error size-5 shrink-0"
        />
        The submission store is not reachable
      </h2>

      <p className="text-body mt-3 text-sm leading-relaxed">
        Submissions cannot be read or written until this is fixed. Anyone using
        the planner right now is being told we could not save their plan.
      </p>

      <dl className="border-error/20 mt-5 space-y-3 border-t pt-5 text-xs">
        <div>
          <dt className="text-muted tracking-[0.08em] uppercase">Trying to reach</dt>
          <dd className="text-navy mt-1 font-medium break-all">{target}</dd>
        </div>
        <div>
          <dt className="text-muted tracking-[0.08em] uppercase">It said</dt>
          <dd className="text-body mt-1 break-all">{detail}</dd>
        </div>
      </dl>

      <div className="border-error/20 mt-5 border-t pt-5">
        <p className="text-muted text-xs tracking-[0.08em] uppercase">
          Usual causes
        </p>
        <ul className="text-body mt-3 space-y-2 text-xs leading-relaxed">
          <li>
            <strong className="text-navy">Connection refused</strong> — the
            database is not running, or the tunnel exposing it has stopped. If
            the database lives on an office machine, check that machine is awake.
          </li>
          <li>
            <strong className="text-navy">Timed out</strong> — a firewall, or an
            address this server cannot route to. Remember that{" "}
            <code className="text-navy">localhost</code> here means this server,
            not yours.
          </li>
          <li>
            <strong className="text-navy">Authentication failed</strong> — the
            password in DATABASE_URL no longer matches, or pg_hba.conf does not
            allow connections from this host.
          </li>
          <li>
            <strong className="text-navy">Certificate</strong> — a self-signed
            certificate needs DATABASE_SSL_NO_VERIFY=true, set knowingly.
          </li>
        </ul>
        <p className="text-muted mt-4 text-xs leading-relaxed">
          <code className="text-navy">npm run check:db</code> runs the same
          connection with a plain-English diagnosis — but run it on a machine
          that sees the database the same way this server does.
        </p>
      </div>
    </div>
  );
}
