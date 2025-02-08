from django import forms
from stages.models import Stage


class StageUpdateFirm(forms.ModelForm):
    class Meta:
        model = Stage
        fields = ('title', 'description', 'start_date', 'end_date')

    def clean_title(self):
        title = self.cleaned_data.get('title')
        return title

    def clean_description(self):
        description = self.cleaned_data.get('description')
        return description

    def clean(self):
        cleaned_data = super().clean()

        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')

        if start_date and end_date and start_date > end_date:
            ... # TODO Дата начала не может быть позднее даты конца

        return cleaned_data


class StageDeleteForm(forms.ModelForm):
    class Meta:
        model = Stage
        fields = ()
