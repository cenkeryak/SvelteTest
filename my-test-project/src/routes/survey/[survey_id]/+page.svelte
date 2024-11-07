<script context="module">
  export async function load({ params, fetch }) {
    const response = await fetch(`http://127.0.0.1:8000/api/surveys/getSurvey/${params.survey_id}`);
    if (response.ok) {
      const data = await response.json();
      return { surveySchema: data.schema }; // Assuming the API returns the schema in the 'schema' field
    } else {
      console.error("Failed to fetch survey:", response.status);
      return { surveySchema: null };
    }
  }
</script>

<script>
  import { onMount } from 'svelte';

  export let surveySchema = null; // Received from load function

  onMount(async () => {
    if (surveySchema) {
      let JSONEditor;
      try {
        const module = await import('@json-editor/json-editor');
        JSONEditor = module.default || module.JSONEditor;
      } catch (e) {
        console.warn('Failed to load JSONEditor:', e);
        return;
      }

      const element = document.getElementById('editor_holder');
      if (!element) {
        console.error('Editor holder element not found!');
        return;
      }

      // Initialize JSON Editor with readOnly true
      new JSONEditor(element, {
        schema: surveySchema,
        theme: 'tailwind',
        disable_edit_json: true,
        disable_properties: true,
        show_errors: 'never'
      });
    }
  });
</script>

<main class="p-8 bg-gray-100 min-h-screen">
  <h1 class="text-3xl font-bold mb-6 text-center">Survey</h1>

  {#if surveySchema}
    <div
      id="editor_holder"
      class="p-6 bg-white border border-gray-200 rounded-md shadow-lg min-h-[300px]"
    ></div>
  {:else}
    <p class="text-center text-red-500">Failed to load survey data.</p>
  {/if}
</main>
