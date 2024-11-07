<script>
  import { onMount } from 'svelte';
    import { readonly } from 'svelte/store';

  let editor;

  onMount(async () => {
    try {
      console.log('Initializing JSON Editor...');

      // Attempt dynamic import of JSON Editor
      let JSONEditor;
      try {
        const module = await import('@json-editor/json-editor');
        JSONEditor = module.default || module.JSONEditor;
      } catch (e) {
        console.warn('Dynamic import failed. Trying global fallback...');
        JSONEditor = window.JSONEditor;
      }

      if (!JSONEditor) {
        console.error('JSONEditor is not available');
        return;
      }

      console.log('JSON Editor loaded:', JSONEditor);

      const element = document.getElementById('editor_holder');
      if (!element) {
        console.error('Editor holder element not found!');
        return;
      }

      const options = {
        theme: 'tailwind',
        schema: {
          title: 'Survey',
          type: 'object',
          properties: {
            name: { type: 'string', title: 'Survey Name' },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string', title: 'Question' },
                  type: {
                    type: 'string',
                    enum: ['text', 'number', 'choice'],
                    title: 'Question Type'
                  },
                  options: {
                    type: 'array',
                    title: 'Options (for choice type)',
                    items: { type: 'string' }
                  }
                }
              }
            }
          }

        },
        disable_collapse: true,
        disable_edit_json: true,
        disable_properties: true,
        readonly: true,
      };

      // Initialize JSON Editor
      editor = new JSONEditor(element, options);
      console.log('JSON Editor initialized successfully');
    } catch (error) {
      console.error('Error initializing JSON Editor:', error);
    }
  });

  async function saveSurvey() {
    if (!editor) {
      console.error('Editor is not initialized!');
      return;
    }

    const schema = editor.getValue(); // Get the JSON schema from the editor
    console.log('Survey schema:', schema);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/surveys/createSurvey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema })
      });

      if (response.ok) {
        alert('Survey saved successfully!');
      } else {
        console.error('Failed to save survey:', await response.json());
        alert('Failed to save survey');
      }
    } catch (error) {
      console.error('Error while saving survey:', error);
    }
  }
</script>

<main class="p-8 min-h-screen bg-gray-50">
  <h1 class="text-3xl font-extrabold text-center text-gray-800 mb-6">
    Admin Survey
  </h1>

  <div
    id="editor_holder"
    class="p-6 bg-white border border-gray-200 rounded-md shadow-lg min-h-[300px]"
  ></div>

  <button
    class="mt-6 w-full py-3 px-4 text-white bg-blue-600 rounded-md font-bold hover:bg-blue-700 transition duration-300"
    on:click={saveSurvey}
  >
    Save Survey
  </button>
</main>
