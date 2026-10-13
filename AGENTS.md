<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep qualification definitions and Zod validation in a client-safe shared module so the form and server enforce identical options.
- Public lead capture uses a validated server function and an anonymous insert-only RLS client; visitor reads are forbidden to protect contact details.
- Maintain landing page visual roles in src/styles.css and reusable form and brand components outside route files to keep presentation consistent.
