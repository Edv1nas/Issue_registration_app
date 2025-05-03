import { Container, Card, CardContent} from '@mui/material';

const AuthLayout = ({ children }) => {
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Card elevation={4} sx={{ width: '100%', p: 2 }}>
        <CardContent>{children}</CardContent>
      </Card>
    </Container>
  );
};

export default AuthLayout;