<script>
  import { onMount } from 'svelte';

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

      // Define the survey schema with sample questions
      const userSchema = {
        title: 'Customer Feedback Survey',
        description: 'Please answer the following questions.',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'What is your name?',
          },
          age: {
            type: 'integer',
            title: 'How old are you?',
          },
          favorite_food: {
            type: 'string',
            title: 'What is your favorite food?',
          },
          city: {
            type: 'string',
            title: 'Which city do you live in?',
          }
        },
        required: ['name', 'age', 'favorite_food', 'city']
      };

      // Options for JSONEditor
      const options = {
        schema: userSchema,
        theme: 'tailwind',
        disable_edit_json: true,
        disable_properties: true,
        disable_collapse: true, // Removes the collapse/expand button
        show_errors: 'interaction', // Shows errors only on interaction
        form_name_root: 'SurveyForm'
      };

      // Initialize JSON Editor in user mode
      const editor = new JSONEditor(document.getElementById('editor_holder'), options);

      // Additional styling to enhance the form look
      document.getElementById('editor_holder').classList.add(
        'p-6', 
        'bg-white', 
        'rounded-lg', 
        'shadow-md', 
        'border', 
        'border-gray-200', 
        'space-y-4'
      );

      // Styling to remove default styling and create a user-friendly layout
      const styleTag = document.createElement("style");
      styleTag.textContent = `
        .je-object__title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #374151;
          margin-bottom: 1rem;
        }
        .je-object__description {
          font-size: 1.1rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
        }
        .form-control {
          margin-top: 1rem;
          padding: 0.75rem;
          font-size: 1rem;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          width: 100%;
          box-sizing: border-box;
        }
        .form-control:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
        }
        .je-required {
          color: #dc2626; /* Red for required labels */
        }
        .je-root > .je-object__property, .je-root > .je-object__property--row {
          border-bottom: 1px solid #e5e7eb;
          padding: 0.5rem 0;
        }
        .je-submit {
          padding: 0.75rem 1.5rem;
          background-color: #3b82f6;
          color: #fff;
          font-weight: bold;
          border-radius: 0.375rem;
          border: none;
          cursor: pointer;
          margin-top: 1rem;
        }
        .je-submit:hover {
          background-color: #2563eb;
        }
      `;
      document.head.appendChild(styleTag);




      // Initialize JSON Editor
      //editor = new JSONEditor(element, options);
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
    Survey
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
