import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${props => props.theme.body};
    color: ${props => props.theme.text};
    transition: all 0.25s ease-in-out;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.text};
    margin-top: 0;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  /* Custom card styling */
  .card {
    background-color: ${props => props.theme.card};
    border-radius: 8px;
    box-shadow: ${props => props.theme.shadow};
    padding: 20px;
    margin-bottom: 20px;
  }

  /* Form elements */
  input, select, textarea {
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    border-radius: 4px;
    color: ${props => props.theme.text};
    padding: 8px 12px;
    
    &:focus {
      border-color: ${props => props.theme.primary};
      outline: none;
    }
  }
`;

export default GlobalStyles; 