from django import forms
from stages.models import Step


class StepUpdateFirm(forms.ModelForm):
    class Meta:
        model = Step
        fields = ('title', 'description', 'max_possible_value', 'deadline', 'order')

    def clean_title(self):
        title = self.cleaned_data.get('title')

    def clean_description(self):
        description = self.cleaned_data.get('description')

    def clean_max_possible_value(self):
        max_possible_value = self.cleaned_data.get('max_possible_value')
        ... # TODO проверить что балл не какой-то странный

    def clean_deadline(self):
        deadline = self.cleaned_data.get('deadline')
        ... # TODO проверить является ли он в сроках сдачи работы


class StepDeleteForm(forms.ModelForm):
    class Meta:
        model = Step
        fields = ()
