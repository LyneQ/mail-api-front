<script lang="ts">
	import '../app.css';
	import '~/variable.css';
	import { config } from '$lib/stores/config';
	import { page } from '$app/state';
	import { ModeWatcher } from 'mode-watcher';
	import useAuth from '$lib/composables/useAuth';

	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import LogIn from '@lucide/svelte/icons/log-in';
	import LogOut from '@lucide/svelte/icons/log-out';
	import UserRoundPlus from '@lucide/svelte/icons/user-round-plus';
	import Inbox from '@lucide/svelte/icons/inbox';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import { afterNavigate, goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	const isLoggedIn = writable(false);


const pathname = page.url.pathname
	async function logout() {
		await fetch(`${$config.apiUrl}signout`, {
			method: "GET",
			credentials: "include"
		})
		return goto("/");
	}

	afterNavigate(async () => {
		const loggedInStatus = await useAuth();
		isLoggedIn.set(loggedInStatus);

		if ( pathname === '/auth' && loggedInStatus ) {
			return goto('/');
		}
	});
</script>


<main>
	<ModeWatcher />
	<div id="ModeSwitcher">
		<Button onclick={toggleMode} variant="outline" size="icon">
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
	<header>
		<nav id="nav">
			<h1 id="logo">
				<a href="/"> {$config.appName}</a>
			</h1>
			<div class="auth">
				{#if !$isLoggedIn }
					<ul class="buttonGroup">
						<li class="buttonGroup-item">
							<Button href="/auth" variant="outline" size="sm">
								<UserRoundPlus />
								s'enregistrer
							</Button>
						</li>
						<li>
							<Button href="/auth" variant="outline" size="sm">
								<LogIn />
								se connecter
							</Button>
						</li>
					</ul>
				{/if}
				{#if $isLoggedIn }
					<Button href="/u/0/inbox" variant="outline" size="sm"> <Inbox /> Boite de réception</Button>
					<Button href="/" onclick={() => logout()} variant="outline" size="sm"> <LogOut />se déconnecter</Button>
					{/if}
			</div>
		</nav>
	</header>

	{@render children()}
</main>

<style lang="scss">
  #ModeSwitcher {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  #nav {
    margin: 1rem 2rem;
    display: inline-flex;
    max-height: 3rem;

    #logo {
      font-size: 1.5rem;
      font-weight: bold;
      background: #4C18CF;
      background: linear-gradient(to right, var(--v-primary) 35%, var(--v-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

    }

    .auth {
      position: absolute;
      right: 4rem;

      .buttonGroup {
        display: flex;
        flex-direction: row;
        gap: 1rem;
      }
    }
  }

  .buttonGroup {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
</style>
