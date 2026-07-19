'use client';

import { Toast } from '@base-ui-components/react/toast';
import { X } from 'lucide-react';
import styles from './Toaster.module.css';

// A standalone toast manager: `toaster.add({ title })` can be called from
// anywhere (event handlers, non-React code) and the mounted <Toaster/> renders
// the toasts. Bottom-right, matching Base UI's toast primitives.
export const toaster = Toast.createToastManager();

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast} className={styles.toast}>
      <div className={styles.body}>
        <Toast.Title className={styles.title} />
        {toast.description && (
          <Toast.Description className={styles.description} />
        )}
      </div>
      <Toast.Close className={styles.close} aria-label="Dismiss">
        <X size={14} />
      </Toast.Close>
    </Toast.Root>
  ));
}

/** Mounts the toast viewport (bottom-right). Render once per page. */
export default function Toaster() {
  return (
    <Toast.Provider toastManager={toaster}>
      <Toast.Portal>
        <Toast.Viewport className={styles.viewport}>
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
