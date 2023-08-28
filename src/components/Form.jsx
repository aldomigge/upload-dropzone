import { styled } from '@mui/material';

export const Form = ({ children, ...props }) => {
  return <FormStyled {...props}>{children}</FormStyled>;
};

const FormStyled = styled('form')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  marginTop: theme.spacing(1),
}));
