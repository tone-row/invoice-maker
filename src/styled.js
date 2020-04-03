import styled from "styled-components";

export const Details = styled.div`
  > * {
    display: block;
  }
`;

export const Table = styled.div`
  width: 100%;
  border: solid 2pt black;
  border-width: 2pt 0;
  padding: 2cm 0;
`;

export const Form = styled.div`
  padding: 1rem;
  @media print {
    display: none;
  }

  h1 {
    font-size: 3em;
  }
  h2 {
    font-size: 2rem;
  }

  input[type="text"],
  input[type="number"] {
    margin: 0 5px;
    padding: 10px;
    border: dashed 1px;
    font-size: 1.5em;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  label {
    display: block;
    width: 400px;
    text-align: right;
    margin-bottom: 10px;
  }

  li {
    margin-bottom: 10px;
    button {
      width: 395px;
    }
  }

  button {
    text-transform: uppercase;
    border-radius: 0;
    border: none;
    font-weight: 700;
    font-size: 1.5em;
    padding: 11px 10px;
    cursor: pointer;
    &:hover {
      background: blueviolet;
    }
  }
`;

export const LargeText = styled.div`
  font-size: 2em;
  font-weight: 700;
`;

export const MediumText = styled.div`
  font-size: 1.5em;
  font-weight: 700;
`;

export const MainText = styled.div`
  font-size: 1em;
`;

export const SmallTitle = styled(MainText)`
  text-transform: uppercase;
`;

export const Invoice = styled.div`
  font-size: 12.5pt;
  line-height: 1.3;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 0;
  overflow: hidden;

  a {
    color: black;
    text-decoration: none;
  }

  address {
    font-style: normal;
  }

  @media print {
    height: 100vh;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-column-gap: 1cm;
`;

export const Six = styled.div`
  grid-column: span 6;
`;

export const Half = styled.div`
  grid-column: span 4;
`;

export const Three = styled.div`
  grid-column: span 3;
`;

export const One = styled.div`
  grid-column: span 1;
`;

export const Two = styled.div`
  grid-column: span 2;
`;

export const TotalWrapper = styled.div`
  grid-column: 7 / -1;
`;

export const ExtraSmallText = styled.div`
  font-size: 0.75em;
`;

export const SpaceChildren = styled.div`
  > * {
    margin-bottom: ${({ amt = 1 }) => amt}cm;

    &:last-child {
      margin-bottom: 0 !important;
    }
  }
`;
