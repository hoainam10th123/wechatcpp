import { Button } from "@mui/material"
import agent from "../../api/agent"
import { useState } from "react";
import ValidationErrors from "./ValidationErrors";

export default function TestError() {
    const [errors, setErrors] = useState(null);

    const NotFound = () => {
        agent.Error.notFound().catch(err => console.log(err.response))
    }

    const BadRequest = () => {
        agent.Error.badRequest().catch(err => console.log(err.response))
    }

    const Unauthorized = () => {
        agent.Error.unauthorized().catch(err => console.log(err.response))
    }

    const Forbidden = () => {
        agent.Error.forbidden().catch(err => console.log(err.response))
    }

    const Validation = () => {
        agent.Error.validation().catch(err => {
            console.log(err.response)
            setErrors(err)
        })
    }

    const serverError = () => {
        agent.Error.serverError().catch(err => console.log(err.response))
    }

    return (
        <>
            <div style={{ marginTop: 10 }}>
                <Button onClick={NotFound} >Not Found</Button>
                <Button onClick={BadRequest} >Bad Request</Button>
                <Button onClick={serverError} >Server Error</Button>
                <Button onClick={Unauthorized} >Unauthorised</Button>
                <Button onClick={Forbidden} >Forbidden</Button>
                <Button onClick={Validation} >validationError</Button>
            </div>
            <div>
                {errors && <ValidationErrors errors={errors} />}
            </div>
        </>
    )
}