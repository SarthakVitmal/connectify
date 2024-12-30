import * as Dialog from '@radix-ui/react-dialog';
import {Button} from '@/components/ui/button';

const MyDialog = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <Button>Open Dialog</Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <p>Your content here...</p>
    </Dialog.Content>
  </Dialog.Root>
);
