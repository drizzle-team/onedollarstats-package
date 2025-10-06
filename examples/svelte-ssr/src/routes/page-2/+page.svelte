<script lang="ts">
  import { event } from "onedollarstats";
</script>

<div
  class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100"
>
  <main class="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 space-y-6">
    <h1 class="text-4xl md:text-5xl font-bold">OneDollarStats Example</h1>

    <p class="text-lg text-gray-600 dark:text-gray-400 max-w-md">
      Open Network tab in DevTools, filter "All", and click the buttons below to see events being sent.
    </p>

    <div class="flex flex-col md:flex-row gap-4">
      <a
        href="/"
        class="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
      >
        Go to /
      </a>

      <button
        onclick={() => event("click", "/custom-path", { label: "Track Event" })}
        class="px-5 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
      >
        Track Event
      </button>
    </div>
  </main>
</div>
