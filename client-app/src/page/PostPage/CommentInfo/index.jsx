import React from 'react';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      '& > * + *': {
        marginTop: theme.spacing(1),
      },
    },
  }));
function CommentInfo(props) {
    const [starValue, setStarValue] = React.useState(5);
    const classes = useStyles();
    const _handleChangeStar = (value) => {
        const star = Number(value.target.value);
        setStarValue(star);
    };
    return (
        <div class="card mt-2">
            <h5 class="card-header">Bình luận</h5>
            <div class="card-body">
                <div className={classes.root}>
                    <Rating
                        name="half-rating"
                        value={starValue}
                        precision={0.5}
                        onChange={(value) => _handleChangeStar(value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default CommentInfo;
