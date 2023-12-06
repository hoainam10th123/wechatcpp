interface Props{
    errors: string[];
}

export default function ValidationErrors({errors}: Props){
    return (
        <div>
            {errors && (errors.map((err:string, i)=>(
                <div key={i} style={{color: 'red'}}>{err}</div>
            )))}
        </div>
    );
}