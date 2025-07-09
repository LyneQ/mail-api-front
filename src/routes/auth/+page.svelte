<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { formSchema, type FormSchema } from './schema';
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } =
		$props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData} = form;
	const errorMessage = writable('');


	async function login(username: string, password: string) {
		try {
			const response = await fetch('http://localhost:1323/api/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: username, password: password }),
				credentials: 'include'
			});

			if (response.status !== 200) {
				// Handle HTTP errors
				const errorData = await response.json();
				errorMessage.set(errorData.message || 'Login failed');
				return;
			}
			await goto('/about')

			// Optional: redirect or perform other actions
		} catch (err) {
			errorMessage.set('An error occurred during login');
			console.error(err);
		}
	}
</script>


<section id="auth">
	<div id="hero">
		<div class="hero-content">
			<h2>s'authentifier</h2>
			<p>en utilisant Mail-Api vous passez au niveau supérieur dans la gestion de vos mails</p>
		</div>
	</div>
	<form id="form" onsubmit={() => login($formData.username, $formData.password)}>
		<Form.Field {form} name="username">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Username</Form.Label>
					<Input {...props} type="text" bind:value={$formData.username} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Input {...props} type="password" bind:value={$formData.password} />
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Button class="mt-4 hover:cursor-pointer">Submit</Form.Button>
	</form>
</section>

<style lang="scss">

	#auth {
		height: calc(100vh - 4.3rem);
    display: flex;
    flex-direction: row;
    align-items: center;

    #hero {
      height: 100%;
      width: 50vw;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #111127;
      color: #fff;

      .hero-content {
        text-align: center;

        h2 {
          font-size: 3rem;
          font-weight: 400;
        }

        p {
          font-size: 1.5rem;
          font-weight: 300;
          color: #c5cbd6;
        }
      }
    }
		#form {
			width: 50vw;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
	}

</style>

