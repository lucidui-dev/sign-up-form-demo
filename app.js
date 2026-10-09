import { signal, h, mount, Show } from "@lucidui-dev/core";
import { form, required, email, minLength, Field, Input, Button, Segmented, Checkbox, Card, Stack, Text, toast } from "@lucidui-dev/core/ui";

function SignUp() {
  const plan = signal("pro");
  const agree = signal(false);
  const done = signal(null);
  const f = form({
    name: { value: "", rules: [required("Tell us your name")] },
    mail: { value: "", rules: [required("Add your email"), email()] },
    pass: { value: "", rules: [minLength(8, "Use at least 8 characters")] }
  });

  const submit = f.submit(values => {
    if (!agree.value) { toast("Please accept the terms", { tone: "danger" }); return; }
    done.value = values;
    toast("Welcome aboard", { tone: "success", description: values.mail });
  });

  return Card({ padding: "lg", class: "demo-card" },
    Show({ when: done, fallback: () => h("form", { onSubmit: submit, novalidate: true },
      Stack({ gap: 4 },
        h("h2", { class: "demo-title" }, "Create account today"),
        Text({ tone: "muted" }, "Free for 14 days. No card needed."),
        Field({ label: "Name", field: f.fields.name }, Input({ bind: f.fields.name.value, placeholder: "Ada Lovelace", autocomplete: "name" })),
        Field({ label: "Email", field: f.fields.mail }, Input({ bind: f.fields.mail.value, type: "email", placeholder: "ada@example.com", autocomplete: "email" })),
        Field({ label: "Password", field: f.fields.pass, hint: "8 characters or more" }, Input({ bind: f.fields.pass.value, type: "password", autocomplete: "new-password" })),
        Field({ label: "Plan" }, Segmented({ value: plan, aria: { label: "Plan" }, options: [{ value: "free", label: "Free" }, { value: "pro", label: "Pro" }, { value: "team", label: "Team" }] })),
        Checkbox({ bind: agree, label: "I agree to the terms" }),
        Button({ type: "submit", variant: "primary", loading: f.submitting }, "Create account"))) },
      () => Stack({ gap: 3 },
        h("h2", { class: "demo-title" }, "You're in, ", done.value.name.split(" ")[0], "."),
        Text({ tone: "muted" }, "We sent a welcome note to ", done.value.mail, ". Your ", plan.value, " trial starts now."),
        Button({ onClick: () => { done.value = null; f.reset(); agree.value = false; } }, "Start over"))));
}

mount(SignUp, "#app");
