import { event } from "onedollarstats";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "OneDollarStats Example" }, { name: "home", content: "OneDollarStats Example" }];
}

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100'>
      <main className='flex-1 flex flex-col items-center justify-center text-center px-6 py-20 space-y-6'>
        <h1 className='text-4xl md:text-5xl font-bold'>OneDollarStats Example</h1>

        <p className='text-lg text-gray-600 dark:text-gray-400 max-w-md'>
          Open Network tab in DevTools, filter "All", and click the buttons below to see events being sent.
        </p>

        <div className='flex flex-col md:flex-row gap-4'>
          <a
            href='/page-2'
            className='px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition'
          >
            Go to /page-2
          </a>

          <button
            onClick={() => event("click-2", "/custom-path-2", { label: "Track Event 2" })}
            className='px-5 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition'
            type='button'
          >
            Track Event
          </button>
        </div>
      </main>
    </div>
  );
}
