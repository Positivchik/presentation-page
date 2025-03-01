import { Layout } from '../../containers/Layout';

export const withLayout = (Component: any) => (props: any) => {
  return (
    <Layout>
      <Component {...props} />
    </Layout>
  );
};
