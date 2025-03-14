from django import forms
from study.models import Subgroup


class SubgroupUpdateFirm(forms.ModelForm):
    class Meta:
        model = Subgroup
        fields = ('title', 'discipline')

    def clean_title(self):
        title = self.cleaned_data.get('title')
        return title

    def clean_description(self):
        discipline = self.cleaned_data.get('discipline')
        return discipline


class SubgroupDeleteForm(forms.ModelForm):
    class Meta:
        model = Subgroup
        fields = ()
