import home from '../content/pages/home.json';

/**
 * Reads its copy from `content/`, which is what makes the repository editable
 * by a content change at all. Text written directly into JSX is exactly the
 * case ADR 0004 says cannot be edited without an engineer refactor first.
 */
const HomePage = () => (
  <main>
    <h1>{home.title}</h1>
    <p>{home.body}</p>
  </main>
);

export default HomePage;
