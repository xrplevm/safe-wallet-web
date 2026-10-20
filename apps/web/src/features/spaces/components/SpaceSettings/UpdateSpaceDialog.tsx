import ModalDialog from '@/components/common/ModalDialog'
import DialogContent from '@mui/material/DialogContent'
import UpdateSpaceForm from './UpdateSpaceForm'
import type { GetSpaceResponse } from '@safe-global/store/gateway/AUTO_GENERATED/spaces'
import { Typography } from '@mui/material'

const UpdateSpaceDialog = ({ space, onClose }: { space: GetSpaceResponse; onClose: () => void }) => {
  return (
    <ModalDialog dialogTitle="Update space" hideChainIndicator open onClose={onClose}>
      <DialogContent sx={{ mt: 2 }}>
        <Typography mb={2}>
          The space name is visible in the sidebar menu, headings to all its members. Usually it&apos;s a name of the
          company or a business.
        </Typography>
        <UpdateSpaceForm space={space} />
      </DialogContent>
    </ModalDialog>
  )
}

export default UpdateSpaceDialog
