import React, { useState, useContext, useRef } from 'react';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import SaveIcon from '@material-ui/icons/Save';
import LoadIcon from '@material-ui/icons/Publish';
import NodeIcon from '@material-ui/icons/AddCircle';
import CollectionIcon from '@material-ui/icons/Share';
import LinkIcon from '@material-ui/icons/PlayForWork';

import { UIContext } from 'contexts/ui';
import { GraphContext } from 'contexts/graph';

import useStyles from './styles';
import ErrorDialog from './Error';

const Actions = () => {
  const classes = useStyles();

  const fileUploader = useRef(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const { loadGraph } = useContext(GraphContext);
  const { setBackdropOpen, setDialogs } = useContext(UIContext);

  const actions = [
    {
      type: 'save',
      icon: <SaveIcon />,
      name: 'Save The Graph',
    },
    {
      type: 'upload',
      icon: <LoadIcon />,
      name: 'Load Graph',
    },
    {
      type: 'collection',
      icon: <CollectionIcon />,
      name: 'Create A Collection',
    },
    {
      type: 'node',
      icon: <NodeIcon />,
      name: 'Create A Node',
    },
    {
      type: 'link',
      name: 'Create A Link',
      icon: <LinkIcon className={classes.icon} />,
    },
  ];

  const handler = type => () => {
    if (type !== 'upload') return setDialogs(type)(true);

    fileUploader.current.click();
  };

  const handleUpload = async ({ target: { files } }) => {
    try {
      setBackdropOpen(true);
      const file = files[0];

      if (file.type !== 'application/json')
        throw new Error('Invalid file format, please upload a .json file');

      const content = await file.text();

      loadGraph(content);
    } catch (e) {
      setError(e.message);
    } finally {
      setBackdropOpen(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setBackdropOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBackdropOpen(false);
  };

  const handleErrorClose = () => {
    setError(false);
  };

  return (
    <div className={classes.root}>
      {error && (
        <ErrorDialog
          open={!!error}
          message={error}
          handleClose={handleErrorClose}
        />
      )}
      <input
        id="file"
        type="file"
        ref={fileUploader}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
      <SpeedDial
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        icon={<SpeedDialIcon />}
        className={classes.speedDial}
        ariaLabel="Open Actions Dial"
      >
        {actions.map(action => (
          <SpeedDialAction
            tooltipOpen
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handler(action.type)}
            classes={{ staticTooltipLabel: classes.tooltip }}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default Actions;
