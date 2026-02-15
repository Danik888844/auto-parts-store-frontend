import {
  Component,
  Inject,
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {NgClass} from '@angular/common';
import {
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../../core/services/user.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslateModule,
  ],
})
export class DialogContentComponent {
  title: string = 'Title';
  content: string = 'Content';
  btnText: string = 'Ok';

  hideCancel = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogContentComponent>,
    private userService: UserService,
  ) {
    this.title = data?.title;
    this.content = data?.content;
    this.btnText = data?.btnText;
    this.hideCancel = data?.hideCancel || false;
  }

  clickHandle() {
    if (this.data?.isLogout) {
      return this.logOut();
    }

    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  logOut(): void {
    UserService.logout();

    this.userService.logout().subscribe({
      next: () => {
        this.dialogRef.close();
      },
    });
  }
}
