---
name: deploy-to-vercel-production
description: Ships the current branch's committed work to the live Vercel production site by fast-forward-pushing it onto the repo's production branch, which is what actually triggers Vercel's GitHub integration to build and publish. Use whenever the user asks to "deploy", "ship this", "push live", "make this live", "go live", "update the live site", or "publish the changes" in a repo connected to Vercel. Do not use this for local/preview testing, for repos without a `.vercel/project.json`, or for anything the user hasn't explicitly asked to see live -- this skill's whole purpose is a production-affecting action, so treat every invocation as needing fresh, explicit confirmation.
---

# Deploy to Vercel Production

## Why this works the way it does

Vercel's GitHub integration deploys automatically on every push: a push to a
feature branch makes a **Preview Deployment** (a throwaway URL), a push to
the **production branch** makes the **live site update**. There is no
separate "deploy" action to run -- the deploy already happens the moment the
right branch gets the right commits. So "deploy to production" reduces to
one question: *how do these commits get onto the production branch?*

That also means this skill is inherently a production-affecting, hard-to-
reverse action once the push lands -- there's no draft state and no undo.
Treat the confirmation step below as load-bearing, not a formality, even if
the user approved a deploy earlier in the same conversation: a different
diff each time means a fresh confirmation each time.

## Step 1: Confirm this repo actually deploys this way

Check for `.vercel/project.json` (created by `vercel link`; its presence
means the repo is linked to a specific Vercel project by `projectId`/
`orgId`). If it's missing, stop and ask the user how this project deploys --
it may use a different provider, a manual `vercel --prod` flow, or nothing
automated at all. Don't assume.

## Step 2: Determine the production branch

Vercel defaults the production branch to the repo's default branch. Get it
without guessing:

```bash
git symbolic-ref refs/remotes/origin/HEAD   # -> refs/remotes/origin/<branch>
```

Treat that branch as production **unless the user has told you otherwise**.
Vercel's project settings can override this, and there is no way to read
that setting without an authenticated `vercel` CLI or dashboard access --
if the user says production is a different branch, believe them over git.

## Step 3: Make sure there's something clean to ship

- `git status` -- if there are uncommitted changes, stop and ask whether to
  commit them first. Don't deploy uncommitted work; don't auto-commit
  without asking either, since you don't know if it's finished.
- If the current branch *is* the production branch, there's nothing to do
  -- say so.

## Step 4: Show the user exactly what's about to go live, and stop

```bash
git fetch origin <production-branch>
git log origin/<production-branch>..HEAD --oneline
```

Show that commit list to the user (not just "N commits" -- the actual
one-line summaries) and name the branch you're about to push to as the live
production branch. Then wait for an explicit go-ahead in this turn. Do not
proceed on the strength of an earlier approval for a different diff.

## Step 5: Verify it's a fast-forward, then push -- never force

Working from a worktree, `git checkout <production-branch>` is both unsafe
(git refuses if that branch is checked out in another worktree) and
unnecessary. Push directly without ever checking the branch out locally:

```bash
git merge-base --is-ancestor origin/<production-branch> HEAD && echo "fast-forward OK"
```

- **Not a fast-forward** (production has commits this branch doesn't):
  stop. Do not force-push. Tell the user production has diverged and ask
  how they want to reconcile it (rebase onto production, merge it in,
  etc.) -- don't guess which history should win.
- **Is a fast-forward**: push straight to the branch name, which updates
  the remote without touching any local branch or checkout:
  ```bash
  git push origin HEAD:<production-branch>
  ```

If `gh` is installed and the user hasn't indicated urgency, prefer routing
through a PR (`gh pr create`, `gh pr merge --merge`) instead of the direct
push above -- it preserves a review trail and lets any required CI checks
run first. Fall back to the direct push when `gh` isn't available (common
in this environment) or the user explicitly wants it immediate.

## Step 6: After pushing

Nothing else to run -- Vercel's webhook picks up the push automatically.
Tell the user:
- The push succeeded and which branch it landed on.
- Vercel will build and deploy automatically (typically live within a
  couple of minutes).
- To check their Vercel dashboard for the project (`projectName` from
  `.vercel/project.json`) for build logs or the deployed URL. Don't guess
  or construct a dashboard URL -- the team/org slug isn't recoverable from
  `orgId`, and a wrong link is worse than no link.

## The other deploy path: `vercel --prod`

Some setups deploy straight from a working directory instead of through
git -- no GitHub integration, or the user wants to preview an unreviewed
build. `vercel --prod` (via the `vercel` CLI, `npx vercel --prod` if not
installed) builds and pushes whatever's on disk directly to production,
bypassing git and the commit history entirely. Only reach for this if the
user asks for it specifically, or Step 1 finds no git-based integration --
for a git-versioned team project, shipping something that isn't reflected
in git history is usually not what anyone actually wants.
