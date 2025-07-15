import React from "react";
import { Avatar, Card, CardContent, Typography, Box } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	card: {
		background: "var(--bg-glass)",
		backdropFilter: "blur(20px)",
		WebkitBackdropFilter: "blur(20px)",
		borderRadius: "var(--border-radius-lg)",
		border: "1px solid rgba(255, 255, 255, 0.1)",
		transition: "var(--transition-normal)",
		position: "relative",
		overflow: "hidden",
		"&:hover": {
			transform: "translateY(-8px)",
			boxShadow: "var(--shadow-hover)",
		},
		"&::before": {
			content: '""',
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			height: "4px",
			background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
		},
	},
	cardContent: {
		padding: "var(--spacing-xl)",
		display: "flex",
		alignItems: "center",
		gap: theme.spacing(3),
	},
	cardAvatar: {
		width: 60,
		height: 60,
		borderRadius: "50%",
		background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "var(--text-light)",
		fontSize: 24,
		boxShadow: "var(--shadow)",
	},
	cardInfo: {
		flex: 1,
	},
	cardTitle: {
		fontSize: "14px",
		color: "var(--text-secondary)",
		fontWeight: 500,
		textTransform: "uppercase",
		letterSpacing: 0.5,
		marginBottom: theme.spacing(1),
	},
	cardValue: {
		fontSize: "2.5rem",
		fontWeight: "bold",
		color: "var(--text-primary)",
		lineHeight: 1,
	},
	skeleton: {
		background: "var(--bg-glass)",
		borderRadius: "var(--border-radius-lg)",
		border: "1px solid rgba(255, 255, 255, 0.1)",
	},
}));

export default function CardCounter(props) {
    const { icon, title, value, loading } = props;
	const classes = useStyles();
    
    if (loading) {
        return (
            <Skeleton 
                variant="rect" 
                height={120} 
                className={classes.skeleton}
                animation="wave"
            />
        );
    }
    
    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
                <Avatar className={classes.cardAvatar}>
                    {icon}
                </Avatar>
                <Box className={classes.cardInfo}>
                    <Typography className={classes.cardTitle}>
                        {title}
                    </Typography>
                    <Typography className={classes.cardValue}>
                        {value}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}