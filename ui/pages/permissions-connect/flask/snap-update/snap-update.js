import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { PageContainerFooter } from '../../../../components/ui/page-container';
import PermissionsConnectFooter from '../../../../components/app/permissions-connect-footer';
import PermissionConnectHeader from '../../../../components/app/permissions-connect-header';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import SnapInstallWarning from '../../../../components/app/flask/snap-install-warning';
import Box from '../../../../components/ui/box/box';
import {
  ALIGN_ITEMS,
  BLOCK_SIZES,
  BORDER_STYLE,
  FLEX_DIRECTION,
  JUSTIFY_CONTENT,
  TYPOGRAPHY,
} from '../../../../helpers/constants/design-system';
import Typography from '../../../../components/ui/typography';
import UpdateSnapPermissionList from '../../../../components/app/flask/update-snap-permission-list';

export default function SnapUpdate({
  request,
  approveSnapUpdate,
  rejectSnapUpdate,
  targetSubjectMetadata,
}) {
  const t = useI18nContext();

  const [isShowingWarning, setIsShowingWarning] = useState(false);

  const onCancel = useCallback(() => rejectSnapUpdate(request.metadata.id), [
    request,
    rejectSnapUpdate,
  ]);

  const onSubmit = useCallback(() => approveSnapUpdate(request), [
    request,
    approveSnapUpdate,
  ]);

  const shouldShowWarning = useMemo(
    () =>
      Boolean(
        request.permissions &&
          Object.keys(request.permissions).find((v) =>
            v.startsWith('snap_getBip44Entropy_'),
          ),
      ),
    [request.permissions],
  );

  return (
    <Box
      className="page-container snap-update"
      justifyContent={JUSTIFY_CONTENT.SPACE_BETWEEN}
      height={BLOCK_SIZES.FULL}
      borderStyle={BORDER_STYLE.NONE}
      flexDirection={FLEX_DIRECTION.COLUMN}
    >
      <Box
        className="headers"
        alignItems={ALIGN_ITEMS.CENTER}
        flexDirection={FLEX_DIRECTION.COLUMN}
      >
        <PermissionConnectHeader
          icon={targetSubjectMetadata.iconUrl}
          iconName={targetSubjectMetadata.name}
          headerTitle={t('snapUpdate')}
          headerText={null} // TODO(ritave): Add header text when snaps support description
          siteOrigin={request.snapId}
          isSnapUpdate
          snapVersion={request.newVersion}
          boxProps={{ alignItems: ALIGN_ITEMS.CENTER }}
        />
        <Typography
          boxProps={{
            padding: [4, 4, 0, 4],
          }}
          variant={TYPOGRAPHY.H7}
          tag="span"
        >
          {t('snapUpdateExplanation', [`${request.dappOrigin}`])}
        </Typography>
        <Typography
          boxProps={{
            padding: [4, 4, 0, 4],
          }}
          variant={TYPOGRAPHY.H7}
          tag="span"
        >
          {t('snapRequestsPermission')}
        </Typography>
        <UpdateSnapPermissionList
          approvedPermissions={request.approvedPermissions || {}}
          revokedPermissions={request.revokedPermissions || {}}
          newPermissions={request.newPermissions || {}}
        />
      </Box>
      <Box
        className="footers"
        alignItems={ALIGN_ITEMS.CENTER}
        flexDirection={FLEX_DIRECTION.COLUMN}
      >
        {targetSubjectMetadata.sourceCode ? (
          <>
            <div className="source-code">
              <div className="text">{t('areYouDeveloper')}</div>
              <div
                className="link"
                onClick={() =>
                  global.platform.openTab({
                    url: targetSubjectMetadata.sourceCode,
                  })
                }
              >
                {t('openSourceCode')}
              </div>
            </div>
            <Box paddingBottom={4}>
              <PermissionsConnectFooter />
            </Box>
          </>
        ) : (
          <Box className="snap-update__footer--no-source-code" paddingTop={4}>
            <PermissionsConnectFooter />
          </Box>
        )}

        <PageContainerFooter
          cancelButtonType="default"
          onCancel={onCancel}
          cancelText={t('cancel')}
          onSubmit={
            shouldShowWarning ? () => setIsShowingWarning(true) : onSubmit
          }
          submitText={t('approveAndUpdate')}
        />
      </Box>
      {isShowingWarning && (
        <SnapInstallWarning
          onCancel={() => setIsShowingWarning(false)}
          onSubmit={onSubmit}
          snapName={targetSubjectMetadata.name}
        />
      )}
    </Box>
  );
}

SnapUpdate.propTypes = {
  request: PropTypes.object.isRequired,
  approveSnapUpdate: PropTypes.func.isRequired,
  rejectSnapUpdate: PropTypes.func.isRequired,
  targetSubjectMetadata: PropTypes.shape({
    iconUrl: PropTypes.string,
    name: PropTypes.string,
    origin: PropTypes.string.isRequired,
    sourceCode: PropTypes.string,
    version: PropTypes.string,
  }).isRequired,
};
