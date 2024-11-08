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

      // Define a user survey schema with sample questions
      const userSchema = {
        title: 'User Survey', // Overall survey title
        type: 'object',
        properties: {
          title: { 
            type: 'string', 
            title: 'Survey Title', 
            default: 'Customer Feedback Survey', 
            readOnly: true 
          },
          description: { 
            type: 'string', 
            title: 'Survey Description', 
            default: 'Please answer the following questions honestly.', 
            readOnly: true 
          },
          questions: {
            type: 'array',
            title: '',
            items: {
              type: 'object',
              properties: {
                question: { 
                  type: 'string', 
                  title: '', 
                  default: '', 
                  readOnly: true 
                },
                answer: { 
                  type: 'string', 
                  title: 'Answer', 
                  options: { placeholder: "Enter your answer here..." }
                }
              }
            },
            options: {
              disable_array_reorder: true,
              disable_array_delete_last: true,
              disable_array_delete_all: true,
              disable_array_add: true
            }
          }
        }
      };

      // Sample questions defined in the schema
      userSchema.properties.questions.items.properties.question.default = [
        { question: 'What is your name?' },
        { question: 'How old are you?' },
        { question: 'What is your favorite food?' },
        { question: 'What city do you live in?' }
      ];

      // Options to initialize JSON Editor in user mode with tailored styling
      const options = {
        schema: userSchema,
        theme: 'tailwind',
        disable_edit_json: true,       // Disables JSON editor view
        disable_properties: true,      // Disables adding new properties
        disable_array_reorder: true,   // Disables reordering array items
        array_controls: false,         // Disables add/remove controls for arrays
        iconlib: null,                 // Hides icon controls
        show_errors: 'always'          // Always show error messages for required fields
      };

      // Initialize the JSON Editor in user mode
      const editor = new JSONEditor(element, options);

      // Apply additional styling for a user-friendly survey layout
      document.getElementById('editor_holder').classList.add(
        'p-6', 
        'bg-white', 
        'rounded-lg', 
        'shadow-md', 
        'border', 
        'border-gray-200', 
        'space-y-4'
      );

      // Define CSS for each question item to resemble a typical form input
      const styleTag = document.createElement("style");
      styleTag.textContent = `
        .je-question .je-object__title {
          font-size: 1.2rem;
          font-weight: bold;
          color: #374151;
        }
        .je-question .je-object__description {
          font-size: 1rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }
        .je-question .je-array__controls, 
        .je-question .je-array__add, 
        .je-question .je-array__delete {
          display: none !important;
        }
        .je-question .form-control {
          margin-top: 1rem;
          padding: 0.5rem;
          font-size: 1rem;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          width: 100%;
        }
        .je-question .form-control:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .je-question .je-field, .je-question .je-property {
          margin-top: 1rem;
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
