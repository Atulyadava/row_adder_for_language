
import React, { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useAPI";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Language {
  id: string;
  is_active?: number;
  language_name: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(
  languageName: string,
  selectedLanguages: readonly Language[],
  theme: Theme
) {
  return {
    fontWeight:
      selectedLanguages
        .map((lang) => lang.language_name)
        .indexOf(languageName) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function StudentLenguage() {
  let StudentId = localStorage.getItem("_id");
  console.log(StudentId);
  // const storeLanguage: Language[] = [];
  interface Box {
    id: number;
    language_id: any;
    proficiency: any;
  }
  const { getData, postData, putData } = useApi();

  const theme = useTheme();
  const [alllanguage, setAllLanguage] = React.useState<Language[]>([]);
  const [selectedLeng, setSelectedLeng] = useState<any>();
  const [editFalg, setEditFlag] = useState<boolean>(false);
  //const [selectedLeng,setSelectedLeng]=useState();
  // const [id, setId] = useState([]);

  // const handleIdChange = () => {
  //   setId();

  // };

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [proficiency, setProficiency] = useState<any>("read");

  const addRow = () => {
    // const newBox: Box = {
    //   id: boxes.length + 1,
    //   language_id: "",
    //   proficiency: "",
    // };
    // setBoxes([...boxes, newBox]);
    setBoxes((prevBoxes) => [
      ...prevBoxes,
      { id: 0, language_id: "", proficiency: "" },
    ]);
  };

  const deleterow = (id: any) => {
    setBoxes(boxes.filter((box) => box.id !== id));
  };

  useEffect(() => {
    getData(`${"language/list"}`)
      .then((data: any) => {
        if (data?.status === 200) {
          setAllLanguage(data?.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
    getData(`${"student_language_known/edit/" + StudentId}`)
      .then((data: any) => {
        console.log(data);
        if (data?.status === 200) {
          //    setAllLanguage(data?.data);
          const lenduageIds = data.data.language_id;
          setSelectedLeng(lenduageIds);
          data.data.map((item: any, index: number) => {
            const newBox: Box = {
              id: item.id,
              language_id: item.language_id,
              proficiency: item.proficiency,
            };
            if (!boxes.some((box) => box.id === newBox.id)) {
              // setBoxes([...boxes, newBox]);
              setBoxes((prevBoxes) => [...prevBoxes, newBox]);
            }
          });
        } else if (data?.status === 404) {
          setBoxes([{ id: 1, language_id: "", proficiency: "" }]);
          setEditFlag(true);
        } else {
          toast.error(data?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  }, []);

  // const saveLanguage = (event: React.FormEvent<HTMLFormElement| typeof setSelectedLeng>) => {
  //     event.preventDefault();
  //    // console.log(selectedLeng,proficiency);
  //    let payload={
  //     student_id:StudentId,
  //     language_id:selectedLeng,
  //     proficiency:proficiency
  //    }
  //    postData('student_language_known/add',payload).then((data:any)=>{
  //     console.log(data);

  //    })
  // }
  // const [error, setError]: any = useState({})
  // const [formData, setFormData] = useState({
  //     language_id: '',
  //     proficiency: ''
  // })

  // const validate = () => {
  //     const validationError: any = {}

  // }

  const saveLanguage = (
    event: React.FormEvent<HTMLFormElement | typeof setSelectedLeng>
  ) => {
    event.preventDefault();
    boxes.forEach((box) => {
      const payload = {
        student_id: StudentId,
        language_id: box.language_id,
        proficiency: box.proficiency,
      };
      if (editFalg) {
        postData("student_language_known/add", payload)
          .then((data: any) => {
            toast.success(data?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      } else {
        if (box.id === 0) {
          postData("student_language_known/add", payload)
            .then((data: any) => {
              toast.success(data?.message, {
                hideProgressBar: true,
                theme: "colored",
              });
            })
            .catch((e) => {
              toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
              });
            });
        } else {
          putData("student_language_known/edit/" + box.id, payload)
            .then((data: any) => {
              toast.success(data?.message, {
                hideProgressBar: true,
                theme: "colored",
              });
            })
            .catch((e) => {
              toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
              });
            });
        }
      }
    });

    // payloads.forEach(payload => {

    // });
  };

  //
  const handleChange = (event: SelectChangeEvent<string>, index: number) => {
    const { name, value } = event.target;
    setBoxes((prevBoxes) =>
      prevBoxes.map((box, i) =>
        i === index ? { ...box, language_id: value } : box
      )
    );
    // setFormData({
    //     ...formData, [name]: value
    // })
  };

  const handleChange1 = (event: SelectChangeEvent<string>, index: number) => {
    const { value } = event.target;
    setBoxes((prevBoxes) =>
      prevBoxes.map((box, i) =>
        i === index ? { ...box, proficiency: value } : box
      )
    );
  };

  console.log("boxes sasa", boxes);
  return (
    <form onSubmit={saveLanguage}>
      {boxes.map((box, index) => (
        <div className="row d-flex justify-content-start align-items-center mt-4 ">
          <div className="col-md-4 ">
            <FormControl required sx={{ m: 1, minWidth: 320, width: "100%" }}>
              <InputLabel id="demo-simple-select-required-label">
                Language
              </InputLabel>
              <Select
                labelId={`language-label-${box.id}`}
                id={`language-select-${box.id}`}
                name={`language_${box.id}`}
                value={box.language_id}
                label="language *"
                onChange={(e) => {
                  handleChange(e, index);
                }}
              >
                {alllanguage.map((lang) => (
                  <MenuItem value={lang.id}>{lang.language_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 col-sm-3">
            <FormControl required sx={{ m: 1, minWidth: 220, width: "100%" }}>
              <InputLabel id="demo-simple-select-required-label">
                Proficiency
              </InputLabel>
              <Select
                labelId={`language-label-${box.id}`}
                id={`language-select-${box.id}`}
                name={`language_${box.id}`}
                value={box.proficiency}
                label="proficiency *"
                onChange={(e) => {
                  handleChange1(e, index);
                }}
              >
                <MenuItem value={"read"}>Read</MenuItem>
                <MenuItem value={"write"}>Write</MenuItem>
                <MenuItem value={"both"}>Both</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 col-sm-3">
            <IconButton onClick={addRow} sx={{ width: "35px", height: "35px" }}>
              <AddIcon />
            </IconButton>
            {boxes.length !== 1 && (
              <IconButton
                onClick={() => deleterow(box.id)}
                sx={{ width: "35px", height: "35px", color: "#f70404b8" }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}
      <div className="row justify-content-center">
        <div className="col-md-12">
          <button className="btn btn-primary" style={{ marginTop: "25px" }}>
            save your language
          </button>
        </div>
      </div>
    </form>
  );
}

export default StudentLenguage;

// const StudentLanguageKnown = () => {
//     const language = [
//         'Hindi',
//         'English',
//         'Spanish',
//         'Bengali',
//         'Portuguese',
//         'Russian',
//         'Japanese',
//         'Marathi',
//         'Telugu',
//         'Tamil',
//     ];

//     const theme = useTheme();
//     const [personName, setPersonName] = React.useState<string[]>([]);
//     const ITEM_HEIGHT = 48;
//     const ITEM_PADDING_TOP = 8;
//     const MenuProps = {
//         PaperProps: {
//             style: {
//                 maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//                 width: 250,
//             },
//         },
//     };

//     const getStyles =(name: string, personName: readonly string[], theme: Theme)=>{
//         return {
//             fontWeight:
//                 personName.indexOf(name) === -1
//                     ? theme.typography.fontWeightRegular
//                     : theme.typography.fontWeightMedium,
//         };
//     }

//     const handleChange = (event: SelectChangeEvent<typeof personName>) => {
//         const {
//             target: { value },
//         } = event;
//         setPersonName(
//             // On autofill we get a stringified value.
//             typeof value === 'string' ? value.split(',') : value,
//         );
//     };

//     return (
//         <div className='row justify-content-center'>
//             <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
//                 <Select
//                     multiple
//                     displayEmpty
//                     value={personName}
//                     onChange={handleChange}
//                     input={<OutlinedInput />}
//                     renderValue={(selected) => {
//                         if (selected.length === 0) {
//                             return <em>Choose Language</em>;
//                         }

//                         return selected.join(', ');
//                     }}
//                     MenuProps={MenuProps}
//                     inputProps={{ 'aria-label': 'Without label' }}
//                 >
//                     <MenuItem disabled value="">

//                     </MenuItem>
//                     {language.map((name) => (
//                         <MenuItem
//                             key={name}
//                             value={name}
//                         >
//                             {name}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>
//         </div>
//     );
// }

// import { QUERY_STUDENT_PROFILE_KEYS } from '../../utils/const';

