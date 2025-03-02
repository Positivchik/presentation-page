import { ComponentType, JSX } from 'react';
import { Layout } from '@containers/Layout';

type TWithLayout = <P extends object>(
  Component: ComponentType<P>
) => (props: P) => JSX.Element;

export const withLayout: TWithLayout = (Component) => (props) => {
  return (
    <Layout>
      <Component {...props} />
    </Layout>
  );
};
