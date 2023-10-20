import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('addEmployeeButton') addEmployeeButton: any;
  title = 'EmployeeCRUD';

  employeeForm: FormGroup;

  employees: Employee[];
  employeesToDisplay: Employee[];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = fb.group({});
    this.employees = [];
    this.employeesToDisplay = this.employees;
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstname: this.fb.control('Sahil'),
      lastname: this.fb.control('Verm'),
      phoneNumber: this.fb.control('1234698'),
      email: this.fb.control('xyz@gmail.com'),
    });

    const storedEmployees = localStorage.getItem('employees');

    if (storedEmployees) this.employees = JSON.parse(storedEmployees);
    else this.fetchEmployeeData();
  }

  fetchEmployeeData() {
    this.employeeService.getEmployees().subscribe((res) => {
      for (let emp of res) this.employees.unshift(emp);
      this.employeesToDisplay = this.employees;
      localStorage.setItem('employees', JSON.stringify(this.employees));
    });
  }

  addEmployee() {
    const employee: Employee = {
      firstname: this.FirstName.value,
      lastname: this.LastName.value,
      phoneNumber: this.PhoneNumber.value,
      email: this.Email.value,
    };
    this.employeeService.postEmployee(employee).subscribe((res) => {
      this.employees.unshift(res);
      this.employeesToDisplay = this.employees;
      this.clearForm();
      localStorage.setItem('employees', JSON.stringify(this.employees));
    });
  }

  removeEmployee(event: any) {
    this.employees.forEach((val, index) => {
      if (val.id === parseInt(event)) {
        this.employeeService.deleteEmployee(event).subscribe((res) => {
          this.employees.splice(index, 1);
          localStorage.setItem('employees', JSON.stringify(this.employees));
        });
      }
    });
  }

  editEmployee(event: any) {
    this.employees.forEach((val, ind) => {
      if (val.id === event) this.setForm(val);
    });
    this.removeEmployee(event);
    this.addEmployeeButton.nativeElement.click();
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }

  setForm(emp: Employee) {
    this.FirstName.setValue(emp.firstname);
    this.LastName.setValue(emp.lastname);
    this.PhoneNumber.setValue(emp.phoneNumber);
    this.Email.setValue(emp.email);
    this.fileInput.nativeElement.value = '';
  }

  searchEmployees(event: any) {
    let filteredEmployees: Employee[] = [];
    if (event === '') this.employeesToDisplay = this.employees;
    else {
      filteredEmployees = this.employees.filter((val, index) => {
        const targetKey = val.firstname.toLowerCase() + '' + val.lastname.toLowerCase();
        const searchKey = event.toLowerCase();
        return targetKey.includes(searchKey);
      });
      this.employeesToDisplay = filteredEmployees;
    }
  }

  clearForm() {
    this.FirstName.setValue('');
    this.LastName.setValue('');
    this.PhoneNumber.setValue('');
    this.Email.setValue('');
    this.fileInput.nativeElement.value = '';
  }

  get FirstName(): FormControl {
    return this.employeeForm.get('firstname') as FormControl;
  }
  get LastName(): FormControl {
    return this.employeeForm.get('lastname') as FormControl;
  }
  get PhoneNumber(): FormControl {
    return this.employeeForm.get('phoneNumber') as FormControl;
  }
  get Email(): FormControl {
    return this.employeeForm.get('email') as FormControl;
  }
}
