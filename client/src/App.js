import './App.css';
import {useEffect, useState} from "react";
import {Form, Field, Formik} from "formik";
import * as Yup from "yup"
import {useMutation, useQuery} from "@apollo/client"
import {GET_ALL_USERS, GET_USER} from "./query/user";
import {CREATE_USER} from "./mutations/user";

const FormActions = {
    CREATE: "Create",
    GET: "Get",
    GET_BY_ID: "Get by id 1",
}

const App = () => {

    const {data: allUsersData, loading: allUsersLoading, error, refetch} = useQuery(GET_ALL_USERS)
    const {data: userData, loading: userLoading, error: userError} = useQuery(GET_USER, {
        variables: {
            id: 1
        }
    })
    const [newUser] = useMutation(CREATE_USER)

    const [users, setUsers] = useState([])

    /*useEffect(() => {
        if (!loading) {
            setUsers(data.getAllUsers)
        }
    }, [data])*/

    const [action, setAction] = useState('')

    const onSubmit = (values, {resetForm}) => {
        if (action === FormActions.CREATE) {
            newUser({
                variables: {
                    input: {
                        username: values.username,
                        age: values.age
                    }
                }
            }).then(({data}) => {
                console.log(data)
                setUsers([...users, data.createUser])
                resetForm()
            }).catch(e => {
                alert(e.data || 'Some error occured')
            })
        } else if (action === FormActions.GET) {
            if (!allUsersLoading) {
                console.log(allUsersData.getAllUsers)
                setUsers(allUsersData.getAllUsers)
            }
        } else if (action === FormActions.GET_BY_ID) {
            if (!userLoading) {
                setUsers([userData.getUser])
            }
        }
    }

    if (allUsersLoading) {
        return <p>Loading...</p>
    }

    return (
        <div className="App">
            <Formik
                initialValues={{username: "", age: ""}}
                onSubmit={onSubmit}
            >
                {({initialValues, errors, touched}) => (
                    <Form>
                        <Field name="username" type="text" placeholder={'Username'}/>
                        <Field name="age" type="number" min={0} max={110} placeholder={'Age'}/>

                        <div className="buttons">
                            <button type="submit"
                                    onClick={() => setAction(FormActions.CREATE)}>{FormActions.CREATE}</button>
                            <button type="submit" onClick={() => setAction(FormActions.GET)}>{FormActions.GET}</button>
                            <button type="submit"
                                    onClick={() => setAction(FormActions.GET_BY_ID)}>{FormActions.GET_BY_ID}</button>
                        </div>
                    </Form>
                )}
            </Formik>
            <div className='users'>
                {users && users.map(user => {
                    return (
                        <div className='user'>
                            {user.id}. {user.username} with age {user.age}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default App;
