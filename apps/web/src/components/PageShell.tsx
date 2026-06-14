import type { ReactNode } from 'react';
import classNames from 'classnames';

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

const PageShell = ({ children, className }: PageShellProps) => (
  <div
    className={classNames(
      'min-h-screen bg-white text-gray-900 dark:bg-canvas-base dark:text-gray-100',
      className
    )}
  >
    {children}
  </div>
);

export default PageShell;
