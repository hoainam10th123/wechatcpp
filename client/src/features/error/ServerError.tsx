import { Alert, Box } from "@mui/material";
import { useStore } from "../../stores/stores";

export default function ServerErrorView() {
    const { commonStore } = useStore();
    return (
        <Box>
            <div>
                <h1>500 Internal server error</h1>
                <h4 style={{color: 'red'}}>{commonStore.error?.message}</h4>
            </div>
            <Alert severity="error"><strong>Stack trace:</strong> {commonStore.error?.stack}</Alert>
        </Box>
    );
}